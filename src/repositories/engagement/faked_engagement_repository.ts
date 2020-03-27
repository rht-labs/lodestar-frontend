import { EngagementRepository } from './engagement_repository';
import { Engagement } from '../../models/engagement';
import faker from 'faker';

export class FakedEngagementRepository extends EngagementRepository {
  async fetchEngagements(): Promise<Engagement[]> {
    return new Array(8)
      .fill(null)
      .map(() => new Engagement({ name: faker.company.companyName() }));
  }
}
