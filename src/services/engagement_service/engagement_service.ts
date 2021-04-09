import { Engagement, EngagementStatus } from '../../schemas/engagement';
import { EngagementFormConfig } from '../../schemas/engagement_config';

export interface EngagementSearchParameters {
  startDate?: Date;
  endDate?: Date;
  engagementStatuses?: EngagementStatus[];
  regions?: string[];
  include?: Array<keyof Engagement>;
  exclude?: Array<keyof Engagement>;
  take?: number;
  skip?: number;
}
export interface EngagementService {
  fetchEngagements(
    parameters?: EngagementSearchParameters
  ): Promise<Engagement[]>;
  createEngagement(
    data: Pick<
      Engagement,
      'customer_name' | 'project_name' | 'engagement_region'
    >
  ): Promise<Engagement>;
  saveEngagement(data: Engagement, commitMessage?: string): Promise<Engagement>;
  launchEngagement(data: Engagement): Promise<Engagement>;
  deleteEngagement(data: Engagement): Promise<Engagement>;
  getConfig(): Promise<EngagementFormConfig>;
  checkHasUpdates(engagement: Engagement): Promise<boolean>;
  checkSubdomainUniqueness(subdomain: string): Promise<boolean>;
  getEngagementByCustomerAndProjectName(
    customer_name: string,
    project_name: string
  ): Promise<Engagement>;
}
