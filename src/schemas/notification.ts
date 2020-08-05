import faker from 'faker/locale/en_US';

export enum NotificationType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
  DEFAULT = 'info',
}

export interface Notification {
  title: string;
  message: string;
  type: NotificationType;
}

export abstract class Notification {
  static fromFake(): Notification[] {
    return [
      {
        title: 'Default Notification format',
        message: faker.lorem.paragraph(),
        type: NotificationType.DEFAULT,
      },
      {
        title: 'Test Warning',
        message: faker.lorem.paragraph(),
        type: NotificationType.WARNING,
      },
      {
        title: 'Test Success',
        message: faker.lorem.paragraph(),
        type: NotificationType.SUCCESS,
      },
      {
        title: 'Test Danger',
        message: faker.lorem.paragraph(),
        type: NotificationType.DANGER,
      },
      {
        title: 'Test Info',
        message: faker.lorem.paragraph(),
        type: NotificationType.INFO,
      },
    ];
  }
}
