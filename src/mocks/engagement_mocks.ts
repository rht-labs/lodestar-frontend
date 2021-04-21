import { EngagementUseCase } from '../schemas/engagement';
import faker from 'faker';

export const mockEngagementUseCase = (): EngagementUseCase => {
  return {
    id: faker.random.uuid(),
    description: faker.lorem.sentences(2),
  };
};
