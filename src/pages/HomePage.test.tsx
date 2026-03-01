import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "./HomePage";
import { BrowserRouter } from "react-router-dom";

// Mock the sections to avoid complex GSAP/Lenis side effects in tests
vi.mock("../sections/Hero/Hero", () => ({
  default: () => <div data-testid="hero">Hero Section</div>,
}));
vi.mock("../sections/Projects/Projects", () => ({
  default: () => <div data-testid="projects">Projects Section</div>,
}));
vi.mock("../sections/Services/Services", () => ({
  default: () => <div data-testid="services">Services Section</div>,
}));
vi.mock("../sections/VideoShowcase/VideoShowcase", () => ({
  default: () => <div data-testid="video-showcase">Video Showcase</div>,
}));
vi.mock("../sections/Collaboration/BrandsMarquee", () => ({
  default: () => <div data-testid="brands-marquee">Brands Marquee</div>,
}));

describe("HomePage", () => {
  it("renders all sections", async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("hero")).toBeDefined();
    expect(await screen.findByTestId("projects")).toBeDefined();
    expect(await screen.findByTestId("services")).toBeDefined();
  });
});
