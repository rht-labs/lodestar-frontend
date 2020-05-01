import { Engagement } from '../../schemas/engagement_schema';

export abstract class EngagementService {
  abstract async fetchEngagements(): Promise<Engagement[]>;
  abstract async createEngagement(data: Engagement): Promise<Engagement>;
  abstract async saveEngagement(data: Engagement): Promise<Engagement>;
  abstract async launchEngagement(data: Engagement): Promise<Engagement>;
  abstract async getConfig(): Promise<any>;
}
