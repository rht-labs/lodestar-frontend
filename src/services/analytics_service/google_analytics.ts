import { AnalyticsService } from './analytics_service';
import ReactGA from 'react-ga';
import { AnalyticsEvent } from '../../schemas/analytics';

export interface GoogleAnalyticsOptions {
  trackingCode: string;
}

/**
 * Service calls in this file should be wrapped in a try/catch.
 * Errors in reporting analytics data should not result in an error that
 * adversely affects the application by causing it to crash or show an error
 * to the user.
 */

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
