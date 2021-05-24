import { EngagementService } from '../engagement_service';
import { Engagement } from '../../../schemas/engagement';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { mockEngagementFormConfig } from '../../../mocks/engagement_form_config_mocks';

export class FakedEngagementService implements EngagementService {
  constructor(private shouldUseStaticData: boolean = false) {}
  async fetchEngagements(): Promise<Engagement[]> {
    return new Array(8).fill(null).map((_, i) =>
      Engagement.fromFake(this.shouldUseStaticData, {
        uniqueSuffix: i.toString(),
      })
    );
  }
  async createEngagement(data: Engagement): Promise<Engagement> {
    return data;
  }
  async saveEngagement(data: Engagement): Promise<Engagement> {
    return data;
  }
  async launchEngagement(data: any): Promise<Engagement> {
    return {
      ...data,
      launch: {
        launched_by: 'A Nashvillian',
        launched_date_time: new Date(2020, 1, 1),
      },
    } as Engagement;
  }
  async deleteEngagement(data: Engagement): Promise<Engagement> {
    return data;
  }
  async getConfig(): Promise<EngagementFormConfig> {
    return mockEngagementFormConfig();
  }
  async checkHasUpdates(engagement: Engagement): Promise<boolean> {
    return false;
  }
  async checkSubdomainUniqueness(s: string): Promise<boolean> {
    return true;
  }
  async getEngagementByCustomerAndProjectName(
    customer_name: string,
    project_name: string
  ) {
    return Engagement.fromFake(this.shouldUseStaticData);
  }
  async getEngagementById(id: string) {
    return Engagement.fromFake(this.shouldUseStaticData);
  }
}
