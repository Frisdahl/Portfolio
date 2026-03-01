import "@testing-library/jest-dom";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserver {
  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;

  private callback: IntersectionObserverCallback;

  constructor(
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {},
  ) {
    this.callback = callback;
    this.rootMargin = options.rootMargin ?? "0px";
    this.thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold ?? 0];
  }

  observe(target: Element) {
    const rect = target.getBoundingClientRect();
    const entry = {
      target,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: rect,
      intersectionRect: rect,
      rootBounds: null,
      time: Date.now(),
    } as IntersectionObserverEntry;

    this.callback([entry], this);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

window.ResizeObserver = ResizeObserver;
window.IntersectionObserver = IntersectionObserver;
globalThis.IntersectionObserver = IntersectionObserver;

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
