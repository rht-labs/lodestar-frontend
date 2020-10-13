export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}
