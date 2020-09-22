import faker from 'faker/locale/en_US';

export interface EngagementCategory {
  name: string,
  count: number
}

export abstract class EngagementCategory {
  static fromFake(staticData = false): EngagementCategory {
    return {
      name: staticData ? 'DO500' : faker.lorem.word(),
      count: staticData ? 1 : faker.random.number(15),
    };
  }
}