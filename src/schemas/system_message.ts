import faker from 'faker';
export enum Severity {
  info,
  warning,
  danger,
}

export function getHumanReadableSeverity(severity: Severity) {
  switch (severity) {
    case Severity.info:
      return 'Info';
    case Severity.warning:
      return 'Warning';
    case Severity.danger:
      return 'Danger';
  }
}

export interface SystemMessage {
  severity: Severity;
  message: string;
  updated: Date;
}

export abstract class SystemMessage {
  static fromFake(): SystemMessage {
    return {
      severity: Severity.info,
      message: faker.lorem.sentence(),
      updated: faker.date.recent(),
    };
  }
  static staticFaked(): SystemMessage {
    return {
      severity: Severity.info,
      message: 'System message',
      updated: new Date(2020, 1, 1),
    };
  }
}
