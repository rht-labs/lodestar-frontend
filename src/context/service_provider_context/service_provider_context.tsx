import React, { useContext } from 'react';

import { AnalyticsService } from '../../services/analytics_service/analytics_service';
import { ArtifactService } from '../../services/artifact_service/artifact_service';
import { AuthService } from '../../services/auth_service/authentication_service';
import { CategoryService } from '../../services/category_service/category_service';
import { EnabledUsersService } from '../../services/enabled_users_service/enabled_users_service';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import { NotificationService } from '../../services/notification_service/notification_service';
import { ServiceFactory } from '../../services/factories/service_factory';
import { UseCaseService } from '../../services/use_case_service/use_case_service';
import { VersionService } from '../../services/version_service/version_service';

interface IServiceProvider {
  artifactService: ArtifactService;
  analyticsService: AnalyticsService;
  enabledUsersService:EnabledUsersService;
  engagementService: EngagementService;
  authService: AuthService;
  versionService: VersionService;
  notificationService: NotificationService;
  categoryService: CategoryService;
  useCaseService: UseCaseService;
}

export const ServiceProviderContext = React.createContext<IServiceProvider>(
  null
);

export const ServiceProvider = ({
  children,
  serviceFactory,
}: {
  children: any;
  serviceFactory?: ServiceFactory;
}) => {
  if (!serviceFactory) {
    return null;
  }
  const services: IServiceProvider = serviceFactory();
  return (
    <ServiceProviderContext.Provider value={services}>
      {children}
    </ServiceProviderContext.Provider>
  );
};

export const useServiceProviders = () => useContext(ServiceProviderContext);
