import { EngagementStatus } from './engagement_schema';

export interface EngagementListFilter {
  searchTerm?: string;
  allowedStatuses?: EngagementStatus[];
  sort: SortOption<EngagementSortFields>;
}

export enum EngagementSortFields {
  startDate,
  endDate,
  projectName,
  customerName,
}

export interface SortOption<T = any> {
  sortField: T;
  isAscending: boolean;
}
