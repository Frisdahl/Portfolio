import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
const RESEND_TO = process.env.RESEND_TO_EMAIL || "frisdahlmarketing@gmail.com";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

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

  try {
    const { name, email, company, phone, inquiry, budget } = req.body;

    if (!name || !email || !inquiry) {
      console.warn("[send-email] Validation failed", {
        hasName: Boolean(name),
        hasEmail: Boolean(email),
        hasInquiry: Boolean(inquiry),
      });
      return res.status(400).json({
        error: "Missing required fields: name, email, and inquiry are required",
      });
    }

    const userEmail = String(email).trim();
    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(userEmail);
    const safeCompany = escapeHtml(company ? String(company) : "N/A");
    const safePhone = escapeHtml(phone ? String(phone) : "N/A");
    const safeBudget = escapeHtml(budget ? String(budget) : "Not specified");
    const safeInquiry = escapeHtml(String(inquiry));
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
