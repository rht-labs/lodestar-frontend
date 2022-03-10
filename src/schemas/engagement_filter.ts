import { EngagementStatus } from './engagement';

export interface EngagementFilter {
  searchTerm?: string;
  allowedStatuses?: EngagementStatus[];
  sort?: SortOption<EngagementSortFields>;
  engagementRegions?: string[];
  engagementTypes?: string[];
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
