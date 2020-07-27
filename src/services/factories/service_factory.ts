import { EngagementService } from '../engagement_service/engagement_service';
import { AuthService } from '../auth_service/authentication_service';
import { VersionService } from '../version_service/version_service';
import { NotificationService } from '../notification_service/notification_service';
import { FakedEngagementService } from '../engagement_service/implementations/faked_engagement_service';
import { FakedAuthService } from '../auth_service/implementations/faked_auth_service';
import { Apiv1EngagementService } from '../engagement_service/implementations/apiv1_engagement_service';
import { Apiv1AuthService } from '../auth_service/implementations/apiv1_auth_service';
import { FakedVersionService } from '../version_service/implementations/faked_version_service';
import { Apiv1VersionService } from '../version_service/implementations/apiv1_version_service';
import { FakedNotificationService } from '../notification_service/implementations/faked_notification_service';
import { Config } from '../../schemas/config';

export abstract class ServiceFactory {
  abstract createEngagementService(): EngagementService;
  abstract createAuthService(): AuthService;
  abstract createVersionService(): VersionService;
  abstract createNotificationService(): NotificationService;
}

export class ApiV1ServiceFactory implements ServiceFactory {
  constructor(private config: Config) {}
  createEngagementService(): EngagementService {
    return new Apiv1EngagementService(this.config.backendUrl);
  }
  createAuthService(): AuthService {
    return new Apiv1AuthService(this.config);
  }
  createVersionService(): VersionService {
    return new Apiv1VersionService(this.config.baseUrl);
  }
  createNotificationService(): NotificationService {
    return new FakedNotificationService();
  }
}

export class FakedServiceFactory implements ServiceFactory {
  createEngagementService(): EngagementService {
    return new FakedEngagementService();
  }
  createAuthService(): AuthService {
    return new FakedAuthService();
  }
  createVersionService(): VersionService {
    return new FakedVersionService();
  }
  createNotificationService(): NotificationService {
    return new FakedNotificationService();
  }
}
