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
  logEvent() {
    console.log('logged event');
  }
  logPageView(path: string) {
    console.log('page view', path);
  }
}
