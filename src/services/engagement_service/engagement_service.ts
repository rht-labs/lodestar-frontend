import { Engagement } from '../../schemas/engagement';
import { EngagementFormConfig } from '../../schemas/engagement_config';

export interface EngagementService {
  fetchEngagements(): Promise<Engagement[]>;
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
  checkSubdomainUniqueness(subdomain: string): Promise<boolean>
  getEngagementByCustomerAndProjectName(
    customer_name: string,
    project_name: string
  ): Promise<Engagement>;
}
