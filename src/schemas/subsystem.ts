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
  static fromFake(
    staticData = false,
    options?: { uniqueSuffix?: string }
  ): Subsystem {
    return {
      name: staticData
        ? `Openshift${options?.uniqueSuffix ? options?.uniqueSuffix : ''}`
        : fakeSubsystemNames[
            faker.random.number(fakeSubsystemNames.length - 1)
          ],
      status: staticData
        ? HealthStatus.green
        : HealthStatus[
            Object.keys(HealthStatus)[
              faker.random.number(Object.keys(HealthStatus).length - 1)
            ]
          ],
      state: staticData ? 'provisioned' : 'provisioned',
      access_urls: staticData
        ? []
        : Array.apply(null, new Array(3)).map(_ => ({
            title: faker.lorem.word(),
            url: faker.internet.url(),
          })),
      info: staticData ? 'Deployment In Progress' : faker.lorem.sentence(),
      updated: staticData ? new Date(2020, 1, 1) : faker.date.recent(),
      messages: Array.apply(null, new Array(5)).map(_ =>
        SystemMessage.fromFake(staticData)
      ),
    };
  }
}
