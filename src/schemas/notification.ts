import faker from 'faker/locale/en_US';

export enum NotificationType {
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  DANGER = "danger",
  DEFAULT = "info"
}

export interface Notification {
  title: string,
  message: string,
  type: NotificationType
}

export class Notification {
  title = '';
  message = '';
  type: NotificationType = NotificationType.DEFAULT;

  constructor({title, message, type}: Notification) {
    this.title = title;
    this.message = message;
    this.type = type;
  }

  static allFromFake(): Notification[] {
    return (
      [
        new Notification(
          {
            title: "Default Notification format",
            message: faker.lorem.paragraph(),
            type: NotificationType.DEFAULT
          }),
        new Notification(
          {
            title: "Test Warning",
            message: faker.lorem.paragraph(),
            type: NotificationType.WARNING
          }),
        new Notification(
          {
            title: "Test Success",
            message: faker.lorem.paragraph(),
            type: NotificationType.SUCCESS
          }),
        new Notification(
          {
            title: "Test Danger",
            message: faker.lorem.paragraph(),
            type: NotificationType.DANGER
          }),
        new Notification(
          {
            title: "Test Info",
            message: faker.lorem.paragraph(),
            type: NotificationType.INFO
          }),
      ]
    )
  }
}