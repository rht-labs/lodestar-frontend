import { AnalyticsService } from './analytics_service';
import ReactGA from 'react-ga';
import { AnalyticsEvent } from '../../schemas/analytics';

export interface GoogleAnalyticsOptions {
  trackingCode: string;
}
export class GoogleAnalytics implements AnalyticsService {
  constructor(options: GoogleAnalyticsOptions) {
    console.log(options);
    ReactGA.initialize(options.trackingCode);
  }
  logEvent(event: AnalyticsEvent) {
    console.log('logged event', event);
    ReactGA.event(event);
  }
  logPageView(path: string) {
    console.log('page view', path);
    ReactGA.pageview(path);
  }
}
