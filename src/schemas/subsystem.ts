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

export abstract class Subsystem {
  static fromFake(): Subsystem {
    return {
      name: faker.name.firstName(),
      status: HealthStatus[HealthStatus[fakerStatic.random.number(2)]],
      state: ClusterState[ClusterState[fakerStatic.random.number(1)]],
      info: fakerStatic.lorem.sentence(),
      updated: faker.date.recent(),
      web_console: faker.internet.url(),
      api: faker.internet.url(),
      messages: SystemMessage[SystemMessage[fakerStatic.random.number(3)]],
    };
  }
  static staticFaked(): Subsystem {
    return {
      name: 'openshift',
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
