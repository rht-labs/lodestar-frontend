import { Artifact, EngagementUseCase } from '../schemas/engagement';
import faker from 'faker';

export const mockEngagementUseCase = (): EngagementUseCase => {
  return {
    id: faker.random.uuid(),
    description: faker.lorem.sentences(2),
  };
};

export const mockEngagementArtifact = (useStaticData = false): Artifact => {
  return {
    uuid: useStaticData ? '1' : faker.random.uuid(),
    linkAddress: useStaticData ? 'https://example.com' : faker.internet.url(),
    title: useStaticData ? 'An engagement artifact' : faker.lorem.words(3),
    type: 'demo',
    description: useStaticData
      ? 'Artifact Description'
      : faker.lorem.paragraph(),
  };
};
