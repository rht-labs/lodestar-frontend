import { EngagementStatus } from './engagement';

export interface EngagementFilter {
  searchTerm?: string;
  allowedStatuses?: EngagementStatus[];
  sort?: SortOption<EngagementSortFields>;
  engagementRegions?: string[];
  engagementTypes?: string[];
}

export enum EngagementSortFields {
  startDate = "Start Date",
  endDate = "End Date",
  projectName = "Engagement",
  customerName = "Customer",
}

export interface SortOption<T = any> {
  sortField: T;
  isAscending: boolean;
}
