export enum AnalyticsCategory {
  engagements = 'Engagements',
  search = 'Search',
  profile = 'Profile',
}

export interface AnalyticsEvent {
  category: AnalyticsCategory;
  action: string;
  label?: string;
  value?: number;
}
