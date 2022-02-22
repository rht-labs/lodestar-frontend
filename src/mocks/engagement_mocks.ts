import { Artifact, EngagementUseCase } from '../schemas/engagement';
import faker from 'faker';

export const mockEngagementUseCase = (): EngagementUseCase => {
  return {
    id: faker.random.uuid(),
    engagement_uuid: "1",
    description: faker.lorem.sentences(2),
  };
};

export const mockEngagementArtifact = (useStaticData = false): Artifact => {
  return {
    uuid: useStaticData ? '1' : faker.random.uuid(),
    linkAddress: useStaticData ? 'https://example.com' : faker.internet.url(),
    title: useStaticData ? 'An engagement artifact' : faker.lorem.words(3),
    customer_name: useStaticData ? "Customer A1" : faker.lorem.words(2),
    project_name: useStaticData ? "Residency B1" : faker.lorem.words(2),
    type: 'demo',
    description: useStaticData
      ? 'Artifact Description'
      : faker.lorem.paragraph(),
  };
};
