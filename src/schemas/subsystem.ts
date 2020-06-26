import { SystemMessage } from './system_message';
import { ClusterState, HealthStatus } from './cluster_status';
import faker from 'faker/locale/en_US';

export interface Subsystem {
  name: string;
  status: HealthStatus;
  state: ClusterState;
  info: string;
  updated: Date;
  web_console: string;
  api: string;
  messages: SystemMessage[];
}
const fakeSubsystemNames = ['Openshift Cluster', 'Atlassian', 'IBM Cloud', 'Mural', 'RH SSO'];

export abstract class Subsystem {
  static fromFake(): Subsystem {
    return {
      name: fakeSubsystemNames[faker.random.number(4)],
      status: HealthStatus[HealthStatus[faker.random.number(2)]],
      state: ClusterState[ClusterState[faker.random.number(1)]],
      info: faker.lorem.sentence(),
      updated: faker.date.recent(),
      web_console: faker.internet.url(),
      api: faker.internet.url(),
      messages: SystemMessage[SystemMessage[faker.random.number(3)]],
    };
  }
  static staticFaked(): Subsystem {
    return {
      name: 'Openshift',
      status: HealthStatus.yellow,
      state: ClusterState.provisioning,
      info: 'Deployment In Progress',
      updated: new Date(2020, 1, 1),
      web_console: 'https://console......',
      api: 'https://api.....:6443',
      messages: [SystemMessage.staticFaked()],
    };
  }
}
