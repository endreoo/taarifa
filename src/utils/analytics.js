// Google Analytics 4 configuration
export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 ID

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    hotel_name: 'Taarifa Suites',
    location: 'Parklands, Nairobi'
  });
};

export const trackEvent = (action, params = {}) => {
  window.gtag('event', action, {
    ...params,
    timestamp: new Date().toISOString()
  });
}; 