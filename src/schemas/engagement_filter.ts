import { EngagementStatus } from "./engagement_schema";

export interface EngagementListFilter {
  searchTerm?: string;
  allowedStatuses?: EngagementStatus[];
}