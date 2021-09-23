import { AnalyticsService } from '../analytics_service/analytics_service';
import { ApiV1 } from '../../packages/api_v1_sdk/apiv1';
import { Apiv1ArtifactService } from '../../packages/api_v1_sdk/apiv1_artifact_service';
import { Apiv1AuthService } from '../../packages/api_v1_sdk/apiv1_auth_service';
import { Apiv1CategoryService } from '../../packages/api_v1_sdk/apiv1_category_service';
import { Apiv1EnabledUsersService } from '../../packages/api_v1_sdk/apiv1_enabled_users_service';
import { Apiv1EngagementService } from '../../packages/api_v1_sdk/apiv1_engagement_service';
import { Apiv1SummaryCountService } from './../../packages/api_v1_sdk/apiv1_summary_count_service';
import { Apiv1UseCasesService } from '../../packages/api_v1_sdk/apiv1_use_cases_service';
import { Apiv1VersionService } from '../../packages/api_v1_sdk/apiv1_version_service';
import { ArtifactService } from '../artifact_service/artifact_service';
import { AuthService } from '../auth_service/authentication_service';
import { CategoryService } from '../category_service/category_service';
import { Config } from '../../schemas/config';
import { EnabledUsersService } from '../enabled_users_service/enabled_users_service';
import { EngagementService } from '../engagement_service/engagement_service';
import { FakedAnalytics } from '../analytics_service/faked_analytics';
import { FakedAuthService } from '../auth_service/implementations/faked_auth_service';
import { FakedCategoryService } from '../category_service/implementations/faked_category_service';
import { FakedEngagementService } from '../engagement_service/implementations/faked_engagement_service';
import { FakedNotificationService } from '../notification_service/implementations/faked_notification_service';
import { FakedVersionService } from '../version_service/implementations/faked_version_service';
import { GoogleAnalytics } from '../analytics_service/google_analytics';
import { NotificationService } from '../notification_service/notification_service';
import { SummaryCountService } from '../summary_count_service/summary_count_service';
import { UseCaseService } from '../use_case_service/use_case_service';
import { VersionService } from '../version_service/version_service';

export type ServiceFactory = () => {
  artifactService: ArtifactService;
  enabledUsersService: EnabledUsersService;
  engagementService: EngagementService;
  authService: AuthService;
  versionService: VersionService;
  notificationService: NotificationService;
  categoryService: CategoryService;
  analyticsService: AnalyticsService;
  useCaseService: UseCaseService;
  summaryCountService: SummaryCountService;
};

export const createApiV1Services = (config: Config): ServiceFactory => () => {
  ApiV1.initialize({ ...config, roleMapping: config.roles });
  return {
    artifactService: new Apiv1ArtifactService(),
    analyticsService: new GoogleAnalytics({
      trackingCode: config.analyticsTrackingCode,
    }),
    authService: new Apiv1AuthService(),
    engagementService: new Apiv1EngagementService(),
    notificationService: new FakedNotificationService(),
    versionService: new Apiv1VersionService(),
    categoryService: new Apiv1CategoryService(),
    useCaseService: new Apiv1UseCasesService(),
    enabledUsersService: new Apiv1EnabledUsersService(),
    summaryCountService: new Apiv1SummaryCountService(),
  };
};

export interface FakedServiceFactoryParams {
  shouldUseStaticData: boolean;
}

export const createFakedServices = (
  params: FakedServiceFactoryParams
): ServiceFactory => () => {
  return {
    analyticsService: new FakedAnalytics(),
    authService: new FakedAuthService(),
    engagementService: new FakedEngagementService(params.shouldUseStaticData),
    notificationService: new FakedNotificationService(),
    versionService: new FakedVersionService(),
    categoryService: new FakedCategoryService(),
    enabledUsersService: {},
    useCaseService: {},
    artifactService: {},
  };
};
