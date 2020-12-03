import { AnalyticsService } from './analytics_service';
import ReactGA from 'react-ga';
import { AnalyticsEvent } from '../../schemas/analytics';

export interface GoogleAnalyticsOptions {
  trackingCode: string;
}

export class GoogleAnalytics implements AnalyticsService {
  constructor(options: GoogleAnalyticsOptions) {
    this.initialize(options.trackingCode);
  }

  private initialize(trackingCode: string) {
    try {
      ReactGA.initialize(trackingCode);
    } catch (e) {
      console.error('error initializing google analytics');
    }
  }

  logEvent(event: AnalyticsEvent) {
    try {
      ReactGA.event(event);
    } catch (e) {
      console.error('error logging event');
    }
  }

  logPageView(path: string) {
    try {
      ReactGA.pageview(path);
    } catch (e) {
      console.error('error logging pageview');
    }
  }
}
