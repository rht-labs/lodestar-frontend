import { Subsystem } from './subsystem';
import { SystemMessage } from './system_message';
import faker from 'faker';

export enum HealthStatus {
  yellow = 'yellow',
  green = 'green',
  red = 'red',
}

export function getHumanReadableNameForHealthStatus(status: HealthStatus) {
  switch (status) {
    case HealthStatus.green:
      return 'Green';
    case HealthStatus.yellow:
      return 'Yellow';
    case HealthStatus.red:
      return 'Red';
  }
}

export function getColorForHealthStatus(status: HealthStatus) {
  switch (status) {
    case HealthStatus.green:
      return 'green';
    case HealthStatus.yellow:
      return '#EC7A08';
    case HealthStatus.red:
      return '#C9190B';
    default:
      return 'grey';
  }
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
