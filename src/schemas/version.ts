import faker from 'faker';
export interface Version {
  versions: {
    componentVersions: [
      {
        link_address: string;
        name: string;
        value: string;
      }
    ];
    mainVersion: {
      link_address: string;
      name: string;
      value: string;
    };
  };
}

export abstract class Version {
  static fromFake(useStatic = false) {
    return {
      versions: {
        componentVersions: [
          {
            link_address: useStatic ? 'www.test.com' : faker.internet.url(),
            name: useStatic ? 'testComponent' : faker.system.fileName(),
            value: useStatic ? '0.0.1' : faker.random.number(),
          },
        ],
        mainVersion: {
          link_address: useStatic ? 'www.test.com' : faker.internet.url(),
          name: useStatic ? 'lodestar' : faker.system.fileName(),
          value: useStatic ? '1.0.1' : faker.random.number(),
        },
      },
    };
  }
}
