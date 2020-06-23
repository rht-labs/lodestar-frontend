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

  constructor( { title, message, type }: Notification ){
    this.title = title;
    this.message = message;
    this.type = type;
  }

  static fromFake(): Notification {
    return new Notification({
      title:"Test Title",
      message:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      type: NotificationType.DANGER
    })
  }
}