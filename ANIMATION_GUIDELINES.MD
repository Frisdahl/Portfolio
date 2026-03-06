# Animation Guidelines

- Use useLayoutEffect for GSAP setup when layout matters.
- Scope with gsap.context + cleanup with ctx.revert()
- Prefer transform/opacity for performance.
- Avoid React state for animation state; use refs.
- Scroll-based motion should use ScrollTrigger.