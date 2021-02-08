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
  static fromFake(
    staticData = false,
    options?: { uniqueSuffix: string }
  ): SystemMessage {
    return {
      severity: staticData ? Severity.info : Severity.info,
      message: staticData
        ? `System Message${options?.uniqueSuffix ? options?.uniqueSuffix : ''}`
        : faker.lorem.sentence(),
      updated: staticData ? new Date(2020, 1, 1) : faker.date.recent(),
    };
  }
}
