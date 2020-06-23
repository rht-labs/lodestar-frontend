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
            title: "Test Default Title",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
            type: NotificationType.DEFAULT
          }),
        new Notification(
          {
            title: "Test Warning Title",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
            type: NotificationType.WARNING
          }),
        new Notification(
          {
            title: "Test Success Title",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
            type: NotificationType.SUCCESS
          }),
        new Notification(
          {
            title: "Test Danger Title",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
            type: NotificationType.DANGER
          }),
        new Notification(
          {
            title: "Test Info Title",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
            type: NotificationType.INFO
          }),
      ]
    )
  }
}