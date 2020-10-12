import { AnalyticsService } from './analytics_service';

export class FakedAnalytics implements AnalyticsService {
  logEvent() {
    console.log('FAKED ANALYTICS: logged event');
  }
  logPageView(path: string) {
    console.log('FAKED ANALYTICS: logged page view');
  }
}
