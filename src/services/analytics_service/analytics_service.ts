export interface AnalyticsService {
  logEvent(eventName: string, data: object): void;
  logPageView(path: string): void;
}
