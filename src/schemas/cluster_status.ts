import { Subsystem } from './subsystem';
import { SystemMessage } from './system_message';
import faker from 'faker';

export enum HealthStatus {
  yellow,
  green,
  red,
}

export interface ClusterStatus {
  overall_status: HealthStatus;
  messages: SystemMessage[];
  subsystems: Subsystem[];
}

export abstract class ClusterStatus {
  static fromFake(): ClusterStatus {
    return {
      overall_status: HealthStatus[HealthStatus[faker.random.number(2)]],
      messages: Array.apply(null, new Array(4)).map(x =>
        SystemMessage.fromFake()
      ) as SystemMessage[],
      subsystems: Array.apply(null, new Array(4)).map(x =>
        Subsystem.fromFake()
      ) as Subsystem[],
    };
  }
  static staticFake(): ClusterStatus {
    return {
      overall_status: HealthStatus.green,
      messages: [SystemMessage.staticFaked()],
      subsystems: [Subsystem.staticFaked()],
    };
  }
}
