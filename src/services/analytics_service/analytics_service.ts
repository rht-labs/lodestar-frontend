import { AnalyticsEvent } from '../../schemas/analytics';
export interface AnalyticsService {
  logEvent(event: AnalyticsEvent): void;
  logPageView(path: string): void;
}
