import { Engagement } from '../../schemas/engagement_schema';
import { EngagementFormConfig } from '../../schemas/engagement_config';

export abstract class EngagementService {
  abstract async fetchEngagements(): Promise<Engagement[]>;
  abstract async createEngagement(data: Engagement): Promise<Engagement>;
  abstract async saveEngagement(data: Engagement): Promise<Engagement>;
  abstract async launchEngagement(data: Engagement): Promise<Engagement>;
  abstract async getConfig(): Promise<EngagementFormConfig>;
  abstract async checkHasUpdates(engagement: Engagement): Promise<boolean>;
}
