import { AnalyticsEvent } from '../../schemas/analytics';
import { AnalyticsService } from './analytics_service';

interface Matomo {
  push(item: string[]): void;
}

export class MatomoAnalytics implements AnalyticsService {
  private matomo: Matomo;
  constructor() {
    if (!(window as any)._paq) {
      throw Error('Matomo has not been included in this page');
    }
    this.matomo = (window as any)._paq;
  }

  logEvent = (event: AnalyticsEvent) => {
    console.log('matomo event log');
    this.matomo.push(['trackEvent', event.category, event.action]);
  };
  logPageView = (path: string) => {
    console.log('matomo page view log');
    this.matomo.push(['setCustomUrl', path]);
    this.matomo.push(['trackPageView']);
  };
}
