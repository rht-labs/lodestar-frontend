import {NotificationService} from "../notification_service";
import {Notification} from "../../../schemas/notification"

export class FakedNotificationService implements NotificationService {
  async fetchNotifications(): Promise<Notification[]> {
    return  Notification.fromFake() ;
  }
}
