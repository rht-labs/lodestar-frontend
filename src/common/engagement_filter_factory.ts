import {
  EngagementFilter,
  EngagementSortFields,
} from '../schemas/engagement_filter';
import { Engagement, getEngagementStatus } from '../schemas/engagement';

function hasSearchTermMatch(
  engagement: Partial<Engagement>,
  searchTerm: string = ''
) {
  if (!searchTerm || !engagement) {
    return true;
  }
  const cleanedSearchTerm = searchTerm?.trim()?.toLowerCase();
  const cleanedCustomerName = engagement.customer_name.toLowerCase().trim();
  const cleanedProjectName = engagement.project_name.toLowerCase().trim();
  return (
    cleanedProjectName.includes(cleanedSearchTerm) ||
    cleanedCustomerName.includes(cleanedSearchTerm)
  );
}

/**
 * The Engagement Filter Factory accepts a filter definition as a parameter.
 * It parses the filter definition and returns a single filter function that
 * filters an array of Engagements based on the terms of the filter definition.
 */
export const engagementFilterFactory = (
  filter?: EngagementFilter
): ((engagement: Partial<Engagement>) => boolean) => {
  if (!filter || Object.keys(filter).length === 0) {
    return () => true;
  }
  return (engagement: Partial<Engagement>) => {
    const filterTestResults: boolean[] = [];
    if (filter.allowedStatuses) {
      filterTestResults.push(
        filter.allowedStatuses.includes(getEngagementStatus(engagement))
      );
    }
    if (filter.searchTerm) {
      filterTestResults.push(
        hasSearchTermMatch(engagement, filter?.searchTerm)
      );
    }
    if (filter.engagementRegions) {
      filterTestResults.push(
        filter.engagementRegions.includes(engagement.engagement_region)
      );
    }
    /**
     * If filterTestResult has a length of 0, this means no tests were performed.
     * The default behavior of the filter should be to show engagements.
     * Therefore, we return true
     */
    if (filterTestResults.length === 0) {
      return true;
    }
    /**
     * If filterTestResults has results, we only return if every result is true.
     */
    return filterTestResults.every(r => !!r);
  };
};

const engagementSorters = (sortOrderMultiplier: number = 1) => {
  return {
    startDate: (a: Partial<Engagement>, b: Partial<Engagement>) =>
      (a.start_date > b.start_date ? 1 : -1) * sortOrderMultiplier,

    endDate: (a: Partial<Engagement>, b: Partial<Engagement>) =>
      (a.end_date > b.end_date ? 1 : -1) * sortOrderMultiplier,

    customerName: (a: Partial<Engagement>, b: Partial<Engagement>) =>
      (a.customer_name > b.customer_name ? 1 : -1) * sortOrderMultiplier,

    projectName: (a: Partial<Engagement>, b: Partial<Engagement>) =>
      (a.project_name > b.project_name ? 1 : -1) * sortOrderMultiplier,
  };
};

/**
 * The Engagement Sort Factory parses the `sort` field of the Engagement filter definition.
 * It returns a single function that can be passed to the `sort` method of an Engagement array.
 */
export const engagementSortFactory = ({ sort }: EngagementFilter = {}): ((
  a: Partial<Engagement>,
  b: Partial<Engagement>
) => number) => {
  /**
   * The sort order multiplier translates the isAscending boolean field into
   * an integer that can invert the sort order of the array.
   */
  const sortOrderMultiplier =
    sort?.isAscending === undefined || sort?.isAscending ? 1 : -1;
  if (sort?.sortField === EngagementSortFields.startDate) {
    return engagementSorters(sortOrderMultiplier).startDate;
  }
  if (sort?.sortField === EngagementSortFields.endDate) {
    return engagementSorters(sortOrderMultiplier).endDate;
  }
  if (sort?.sortField === EngagementSortFields.customerName) {
    return engagementSorters(sortOrderMultiplier).customerName;
  }
  if (sort?.sortField === EngagementSortFields.projectName) {
    return engagementSorters(sortOrderMultiplier).projectName;
  }
  return () => 0;
};
