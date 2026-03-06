# Project Context (Frisdahl Studio)

Stack:
- React + TypeScript (Vite)
- GSAP + ScrollTrigger for animations
- Motion/performance-first portfolio site

Goals:
- Premium, smooth motion
- Clean architecture with reusable components/hooks
- Avoid unnecessary re-renders during animations

Structure (typical):
src/
  components/
  pages/
  hooks/
  utils/
  animations/

Notes:
- Prefer gsap.context scoped animations with cleanup.
- Prefer useLayoutEffect for animation setup.