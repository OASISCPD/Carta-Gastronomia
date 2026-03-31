import { reportMetric } from "./metrics";

const toMs = (value: number): number => Math.round(value);

export const initWebVitals = () => {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
    return;
  }

  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        reportMetric("web_vital_lcp_ms", toMs(lastEntry.startTime));
      }
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

    const fcpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        reportMetric("web_vital_fcp_ms", toMs(entry.startTime));
      }
    });
    fcpObserver.observe({ type: "paint", buffered: true });

    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      for (const entry of entryList.getEntries() as Array<PerformanceEntry & { hadRecentInput?: boolean; value?: number }>) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value ?? 0;
        }
      }
      reportMetric("web_vital_cls", Number(clsValue.toFixed(4)));
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });
  } catch {
    // Browser doesn't support one of the observers; ignore gracefully.
  }

  const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (navEntry) {
    reportMetric("web_vital_ttfb_ms", toMs(navEntry.responseStart));
  }
};

