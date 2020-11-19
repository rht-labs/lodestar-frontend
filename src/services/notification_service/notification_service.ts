import { Notification } from '../../schemas/notification';

export abstract class NotificationService {
  abstract async fetchNotifications(): Promise<Notification[]>;
  // abstract async markNotificationsAsRead(): Promise<Notification[]>;
}
