import { SystemMessage } from './system_message';
import { HealthStatus } from './cluster_status';
import faker from 'faker/locale/en_US';

export interface AccessLink {
  url: string;
  title: string;
}

export interface Subsystem {
  name: string;
  status: HealthStatus;
  state: string;
  info: string;
  updated: Date;
  messages: SystemMessage[];
  access_urls: AccessLink[];
}
const fakeSubsystemNames = [
  'Openshift Cluster',
  'Atlassian',
  'IBM Cloud',
  'Mural',
  'RH SSO',
];

export abstract class Subsystem {
  static fromFake(): Subsystem {
    return {
      name:
        fakeSubsystemNames[faker.random.number(fakeSubsystemNames.length - 1)],
      status:
        HealthStatus[
          Object.keys(HealthStatus)[
            faker.random.number(Object.keys(HealthStatus).length - 1)
          ]
        ],
      state: 'provisioned',
      access_urls: Array.apply(null, new Array(3)).map(_ => ({
        title: faker.lorem.word(),
        url: faker.internet.url(),
      })),
      info: faker.lorem.sentence(),
      updated: faker.date.recent(),
      messages: Array.apply(null, new Array(5)).map(_ =>
        SystemMessage.fromFake()
      ),
    };
  }
  static staticFaked(): Subsystem {
    return {
      name: 'Openshift',
      status: HealthStatus.yellow,
      access_urls: [],
      state: 'provisioned',
      info: 'Deployment In Progress',
      updated: new Date(2020, 1, 1),
      messages: [SystemMessage.staticFaked()],
    };
  }
}
