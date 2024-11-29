// Web Vitals tracking
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics({ name, delta, id }) {
  // Send metrics to Google Analytics
  window.gtag('event', name, {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(delta),
    non_interaction: true,
  });
}

export function initVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getLCP(sendToAnalytics);
} 