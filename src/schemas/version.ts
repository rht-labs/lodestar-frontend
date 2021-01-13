import faker from 'faker';
export interface Version {
  link_address?: string;
  name: string;
  value: string;
}
export interface AppVersion {
  componentVersions: Version[];
  mainVersion: Version;
}

export abstract class Version {
  static fromFake(useStatic = false): AppVersion {
    return {
      componentVersions: [
        {
          link_address: useStatic ? 'www.test.com' : faker.internet.url(),
          name: useStatic ? 'testComponent' : faker.system.fileName(),
          value: useStatic ? '0.0.1' : faker.random.number().toString(),
        },
      ],
      mainVersion: {
        link_address: useStatic ? 'www.test.com' : faker.internet.url(),
        name: useStatic ? 'lodestar' : faker.system.fileName(),
        value: useStatic ? '1.0.1' : faker.random.number().toString(),
      },
    };
  }
}
