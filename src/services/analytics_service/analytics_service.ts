export interface AnalyticsService {
  logEvent(): void;
  logPageView(path: string): void;
}
