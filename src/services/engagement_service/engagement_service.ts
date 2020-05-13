import { Engagement } from '../../schemas/engagement_schema';

export abstract class EngagementService {
  abstract async fetchEngagements(): Promise<Engagement[]>;
  abstract async createEngagement(data: any): Promise<Engagement>;
  abstract async saveEngagement(data: any): Promise<Engagement>;
  abstract async launchEngagement(data: any): Promise<Engagement>;
}
