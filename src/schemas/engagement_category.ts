import faker from 'faker/locale/en_US';

export interface EngagementCategory {
  name: string
}

export abstract class EngagementCategory {
  static fromFake(staticData = false): EngagementCategory {
    return {
      name: staticData ? 'DO500' : faker.lorem.word()
    };
  }
}