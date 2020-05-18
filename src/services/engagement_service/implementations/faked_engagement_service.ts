import { EngagementService } from '../engagement_service';
import { Engagement } from '../../../schemas/engagement_schema';

export class FakedEngagementService extends EngagementService {
  async fetchEngagements(): Promise<Engagement[]> {
    return new Array(8).fill(null).map(() => Engagement.fromFake());
  }
  async createEngagement(data: Engagement): Promise<Engagement> {
    return data;
  }
  async saveEngagement(data: any): Promise<Engagement> {
    return data as Engagement;
  }
  async launchEngagement(data: any): Promise<Engagement> {
    return data as Engagement;
  }
  async getConfig(): Promise<any> {
    return {
      openshiftOptions: {
        versions: [
          {
            label: 'v4.1',
            value: '4.1.31',
          },
          {
            label: 'v4.2',
            value: '4.2.16',
          },
          {
            label: 'v4.3',
            value: '4.3.0',
          },
        ],
        'persistent-storage': [
          {
            label: 'None',
            value: 'none',
          },
          {
            label: '50GB',
            value: '50G',
          },
          {
            label: '100GB',
            value: '100G',
          },
          {
            label: '250GB',
            value: '250G',
          },
          {
            label: '500GB',
            value: '500G',
          },
        ],
        'cluster-size': [
          {
            label: 'Small',
            value: 'small',
          },
        ],
      },
      providerOptions: [
        {
          label: 'AWS',
          value: 'ec2',
          regions: [
            {
              label: 'US East 1 (N. Virginia)',
              value: 'us-east-1',
            },
            {
              label: 'US East 2 (Ohio)',
              value: 'us-east-2',
            },
          ],
        },
      ],
      userManagementOptions: {
        rbac: {
          roles: [
            {
              label: 'Developer',
              value: 'developer',
            },
            {
              label: 'Observer',
              value: 'observer',
            },
            {
              label: 'Admin',
              value: 'admin',
            },
          ],
        },
      },
    };
  }
}
