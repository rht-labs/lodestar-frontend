import {
  EngagementListFilter,
  EngagementSortFields,
} from '../schemas/engagement_filter';
import { Engagement, getEngagementStatus } from '../schemas/engagement_schema';

export const engagementFilterFactory = (
  filter?: EngagementListFilter
): ((engagement: Engagement) => boolean) => {
  if (!filter) {
    return () => true;
  }
  return (engagement: Engagement) => {
    const filterResults: boolean[] = [];
    if (filter.allowedStatuses) {
      filterResults.push(
        filter.allowedStatuses.includes(getEngagementStatus(engagement))
      );
    }
    if (filter.searchTerm) {
      filterResults.push(
        engagement.customer_name.toLowerCase().includes(filter.searchTerm) ||
          engagement.project_name.toLowerCase().includes(filter.searchTerm)
      );
    }
    return !!filterResults.length ? filterResults.every(r => !!r) : true;
  };
};

export const engagementSortFactory = (
  filter?: EngagementListFilter
): ((a: Engagement, b: Engagement) => number) => {
  const ascendingIndex =
    filter?.sort?.isAscending === undefined || filter?.sort?.isAscending
      ? 1
      : -1;
  if (filter?.sort?.sortField === EngagementSortFields.startDate) {
    return (a, b) => (a.start_date < b.start_date ? -1 : 1) * ascendingIndex;
  }
  if (filter?.sort?.sortField === EngagementSortFields.endDate) {
    return (a, b) => (a.start_date < b.start_date ? -1 : 1) * ascendingIndex;
  }
  if (filter?.sort?.sortField === EngagementSortFields.customerName) {
    return (a, b) =>
      (a.customer_name < b.customer_name ? -1 : 1) * ascendingIndex;
  }
  if (filter?.sort?.sortField === EngagementSortFields.projectName) {
    return (a, b) =>
      (a.project_name < b.project_name ? -1 : 11) * ascendingIndex;
  }
  return () => 0;
};
