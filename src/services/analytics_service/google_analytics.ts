import { AnalyticsService } from './analytics_service';
import ReactGA from 'react-ga';

export interface GoogleAnalyticsOptions {
  trackingCode: string;
}
export class GoogleAnalytics implements AnalyticsService {
  constructor(options: GoogleAnalyticsOptions) {
    console.log(options);
    ReactGA.initialize(options.trackingCode);
  }
  logEvent(eventName: string, data: object) {
    console.log('logged event', eventName, data);
  }
  logPageView(path: string) {
    console.log('page view', path);
    ReactGA.pageview(path);
  }
}
