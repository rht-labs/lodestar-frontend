import { AnalyticsService } from './analytics_service';
import { AnalyticsEvent } from '../../schemas/analytics';

export class FakedAnalytics implements AnalyticsService {
  logEvent(event: AnalyticsEvent) {
    console.log('FAKED ANALYTICS: logged event', event);
  }
  logPageView(path: string) {
    console.log('FAKED ANALYTICS: logged page view', path);
  }
}
