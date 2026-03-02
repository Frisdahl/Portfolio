import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
const RESEND_TO = process.env.RESEND_TO_EMAIL || "frisdahlmarketing@gmail.com";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_SUBMIT_TIME_MS = 2500;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_LENGTHS = {
  name: 100,
  email: 254,
  company: 120,
  phone: 50,
  inquiry: 3000,
} as const;

const requestLogByIp = new Map<string, number[]>();
const hasUpstashConfig =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasUpstashConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL as string,
      token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
    })
  : null;

const distributedRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_REQUESTS, "10 m"),
      prefix: "ratelimit:contact-form",
      analytics: true,
    })
  : null;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const toTrimmedString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isTooLong = (value: string, maxLength: number) =>
  value.length > maxLength;

const getClientIp = (req: VercelRequest) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].split(",")[0].trim();
  }

  return req.socket.remoteAddress || "unknown";
};

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const timestamps = requestLogByIp.get(ip) || [];
  const validTimestamps = timestamps.filter(
    (timestamp) => now - timestamp <= RATE_LIMIT_WINDOW_MS,
  );

  if (validTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLogByIp.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  requestLogByIp.set(ip, validTimestamps);
  return false;
};

const isSameOriginRequest = (req: VercelRequest) => {
  const originHeader = req.headers.origin;
  const hostHeader = req.headers.host;

  if (!originHeader || !hostHeader) {
    return true;
  }

  try {
    const originHost = new URL(originHeader).host;
    return originHost === hostHeader;
  } catch {
    return false;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    console.warn("[send-email] Rejected non-POST request", {
      method: req.method,
    });
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[send-email] Missing RESEND_API_KEY");
    return res.status(500).json({
      error: "Missing RESEND_API_KEY in environment variables",
    });
  }

  const contentType = req.headers["content-type"];
  if (!contentType || !contentType.includes("application/json")) {
    return res.status(415).json({ error: "Unsupported content type" });
  }

  if (!isSameOriginRequest(req)) {
    console.warn("[send-email] Blocked cross-origin request", {
      origin: req.headers.origin,
      host: req.headers.host,
    });
    return res.status(403).json({ error: "Invalid request origin" });
  }

  const clientIp = getClientIp(req);
  if (distributedRateLimit) {
    try {
      const identifier = `contact:${clientIp}`;
      const result = await distributedRateLimit.limit(identifier);

      res.setHeader("X-RateLimit-Limit", String(result.limit));
      res.setHeader("X-RateLimit-Remaining", String(result.remaining));
      res.setHeader("X-RateLimit-Reset", String(result.reset));

      if (!result.success) {
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil((result.reset - Date.now()) / 1000),
        );
        res.setHeader("Retry-After", String(retryAfterSeconds));

        console.warn("[send-email] Distributed rate limit exceeded", {
          clientIp,
          retryAfterSeconds,
        });
        return res
          .status(429)
          .json({ error: "Too many requests, try again later" });
      }
    } catch (rateLimitError) {
      console.error(
        "[send-email] Upstash rate limiter failed, using fallback",
        {
          rateLimitError,
        },
      );
      if (isRateLimited(clientIp)) {
        console.warn("[send-email] Fallback rate limit exceeded", { clientIp });
        return res
          .status(429)
          .json({ error: "Too many requests, try again later" });
      }
    }
  } else if (isRateLimited(clientIp)) {
    console.warn("[send-email] Rate limit exceeded", { clientIp });
    return res
      .status(429)
      .json({ error: "Too many requests, try again later" });
  }

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const {
      name,
      email,
      company,
      phone,
      inquiry,
      budget,
      website,
      formStartedAt,
    } = body as {
      name?: unknown;
      email?: unknown;
      company?: unknown;
      phone?: unknown;
      inquiry?: unknown;
      budget?: unknown;
      website?: unknown;
      formStartedAt?: unknown;
    };

    const honeypot = toTrimmedString(website);
    if (honeypot.length > 0) {
      console.warn("[send-email] Honeypot triggered", { clientIp });
      return res.status(200).json({ ok: true });
    }

    const startedAt = Number(formStartedAt);
    if (
      !Number.isFinite(startedAt) ||
      Date.now() - startedAt < MIN_SUBMIT_TIME_MS
    ) {
      console.warn("[send-email] Submission blocked by timing check", {
        clientIp,
      });
      return res.status(200).json({ ok: true });
    }

    const normalizedName = toTrimmedString(name);
    const userEmail = toTrimmedString(email).toLowerCase();
    const normalizedCompany = toTrimmedString(company);
    const normalizedPhone = toTrimmedString(phone);
    const normalizedInquiry = toTrimmedString(inquiry);

    if (!normalizedName || !userEmail || !normalizedInquiry) {
      console.warn("[send-email] Validation failed", {
        hasName: Boolean(normalizedName),
        hasEmail: Boolean(userEmail),
        hasInquiry: Boolean(normalizedInquiry),
      });
      return res.status(400).json({
        error: "Missing required fields: name, email, and inquiry are required",
      });
    }

    if (!EMAIL_REGEX.test(userEmail)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (
      isTooLong(normalizedName, MAX_LENGTHS.name) ||
      isTooLong(userEmail, MAX_LENGTHS.email) ||
      isTooLong(normalizedCompany, MAX_LENGTHS.company) ||
      isTooLong(normalizedPhone, MAX_LENGTHS.phone) ||
      isTooLong(normalizedInquiry, MAX_LENGTHS.inquiry)
    ) {
      return res.status(400).json({ error: "One or more fields are too long" });
    }

    const safeName = escapeHtml(normalizedName);
    const safeEmail = escapeHtml(userEmail);
    const safeCompany = escapeHtml(normalizedCompany || "N/A");
    const safePhone = escapeHtml(normalizedPhone || "N/A");
    const safeBudget = escapeHtml(
      typeof budget === "string" && budget.trim().length > 0
        ? budget.trim()
        : "Not specified",
    );
    const safeInquiry = escapeHtml(normalizedInquiry);
    const safeInquiryHtml = safeInquiry.replace(/\n/g, "<br/>");

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM,
      to: RESEND_TO,
      subject: `New Inquiry from ${safeName}`,
      replyTo: userEmail,
      text: `
        Name: ${safeName}
        Email: ${safeEmail}
        Company: ${safeCompany}
        Phone: ${safePhone}
        Budget: ${safeBudget}
        Inquiry: ${safeInquiry}
      `,
      html: `
        <div style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#1c1d1e;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:22px 26px;background:#1c1d1e;color:#fefffe;">
                <div style="font-size:11px;letter-spacing:1.8px;text-transform:uppercase;opacity:.78;">Frisdahl Studio</div>
                <div style="margin-top:8px;font-size:26px;line-height:1.25;font-weight:700;">New Contact Inquiry</div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 26px 12px 26px;">
                <div style="font-size:15px;line-height:1.6;color:#1c1d1e;">A new message was submitted via the portfolio contact form.</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 26px 10px 26px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 10px;">
                  <tr>
                    <td style="width:120px;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:#6b7280;">Name</td>
                    <td style="font-size:15px;color:#111827;font-weight:600;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="width:120px;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:#6b7280;">Email</td>
                    <td style="font-size:15px;color:#111827;"><a href="mailto:${safeEmail}" style="color:#1c1d1e;text-decoration:none;border-bottom:1px solid #d1d5db;">${safeEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="width:120px;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:#6b7280;">Company</td>
                    <td style="font-size:15px;color:#111827;">${safeCompany}</td>
                  </tr>
                  <tr>
                    <td style="width:120px;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:#6b7280;">Phone</td>
                    <td style="font-size:15px;color:#111827;">${safePhone}</td>
                  </tr>
                  <tr>
                    <td style="width:120px;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:#6b7280;">Budget</td>
                    <td style="font-size:15px;color:#111827;">${safeBudget}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 26px 26px 26px;">
                <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:#6b7280;margin-bottom:10px;">Message</div>
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;font-size:15px;line-height:1.65;color:#111827;">${safeInquiryHtml}</div>
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    if (error) {
      console.error("[send-email] Resend rejected request", {
        error,
      });

      const statusCode =
        typeof (error as { statusCode?: unknown }).statusCode === "number"
          ? (error as { statusCode: number }).statusCode
          : 400;

      return res.status(statusCode).json({
        error: error.message || "Failed to send email via Resend",
        code: (error as { name?: string }).name,
      });
    }

    const { error: acknowledgementError } = await resend.emails.send({
      from: RESEND_FROM,
      to: userEmail,
      subject: "We received your inquiry — Frisdahl Studio",
      html: `
        <div style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#1c1d1e;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;background:#1c1d1e;color:#fefffe;">
                <div style="font-size:11px;letter-spacing:1.8px;text-transform:uppercase;opacity:.78;">Frisdahl Studio</div>
                <div style="margin-top:8px;font-size:24px;line-height:1.25;font-weight:700;">Thanks for reaching out</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#111827;">Hi ${safeName},</p>
                <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#111827;">Thanks for your inquiry — I’ve received your message and will get back to you as soon as possible.</p>
                <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#111827;">Usually I reply within 24 hours on business days.</p>
                <div style="margin:18px 0;padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;line-height:1.65;color:#1f2937;">
                  <strong>Your message:</strong><br/>
                  ${safeInquiryHtml}
                </div>
                <p style="margin:18px 0 0 0;font-size:14px;line-height:1.7;color:#4b5563;">Best regards,<br/>Alexander Frisdahl</p>
              </td>
            </tr>
          </table>
        </div>
      `,
      text: `Hi ${safeName},\n\nThanks for your inquiry — I’ve received your message and will get back to you as soon as possible.\n\nUsually I reply within 24 hours on business days.\n\nYour message:\n${safeInquiry}\n\nBest regards,\nAlexander Frisdahl`,
    });

    if (acknowledgementError) {
      console.error("[send-email] Failed to send acknowledgement email", {
        acknowledgementError,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("[send-email] Unhandled error", err);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return res.status(500).json({ error: message });
  }
}
