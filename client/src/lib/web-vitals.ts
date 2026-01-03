import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('[Web Vitals]', metric.name, metric.value, metric.rating);
    }
}

export function reportWebVitals() {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
}
