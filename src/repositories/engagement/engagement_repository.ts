import { Engagement } from '../../models/engagement';

export abstract class EngagementRepository {
  abstract async fetchEngagements(): Promise<Engagement[]>;
  abstract async createEngagement(data: any): Promise<void>;
}
