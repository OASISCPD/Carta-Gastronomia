type MetricValue = number | string | boolean;

interface MetricPayload {
  name: string;
  value: MetricValue;
  context?: Record<string, MetricValue>;
}

declare global {
  interface Window {
    __menuMetrics?: MetricPayload[];
  }
}

export const reportMetric = (
  name: string,
  value: MetricValue,
  context?: Record<string, MetricValue>,
) => {
  const payload: MetricPayload = { name, value, context };

  if (typeof window !== "undefined") {
    const store = window.__menuMetrics ?? [];
    store.push(payload);
    window.__menuMetrics = store.slice(-100);
  }
};
