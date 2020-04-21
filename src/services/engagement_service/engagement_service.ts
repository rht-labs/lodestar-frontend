import { Engagement } from '../../schemas/engagement_schema';

export abstract class EngagementService {
  abstract async fetchEngagements(): Promise<Engagement[]>;
  abstract async createEngagement(data: any): Promise<void>;
}
