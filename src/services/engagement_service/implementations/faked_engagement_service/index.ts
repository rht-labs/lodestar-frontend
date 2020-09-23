import { EngagementService } from '../../engagement_service';
import { Engagement } from '../../../../schemas/engagement';
import { EngagementFormConfig } from '../../../../schemas/engagement_config';

export class FakedEngagementService implements EngagementService {
  constructor(private shouldUseStaticData: boolean = false) {}
  async fetchEngagements(): Promise<Engagement[]> {
    return new Array(8)
      .fill(null)
      .map(() => Engagement.fromFake(this.shouldUseStaticData));
  }
  async createEngagement(data: Engagement): Promise<Engagement> {
    return data;
  }
  async saveEngagement(data: Engagement): Promise<Engagement> {
    console.log('saving engagement: ', data);
    return data as Engagement;
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
  async getConfig(): Promise<EngagementFormConfig> {
    return EngagementFormConfig.fromFake();
  }
  async checkHasUpdates(engagement: Engagement): Promise<boolean> {
    return false;
  }
  async getEngagementByCustomerAndProjectName(
    customer_name: string,
    project_name: string
  ) {
    return Engagement.fromFake(this.shouldUseStaticData);
  }
}
