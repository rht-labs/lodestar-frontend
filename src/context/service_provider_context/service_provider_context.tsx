import React, { useContext } from 'react';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import { AuthService } from '../../services/auth_service/authentication_service';
import { VersionService } from '../../services/version_service/version_service';
import { NotificationService } from '../../services/notification_service/notification_service';
import { ServiceFactory } from '../../services/factories/service_factory';
import { CategoryService } from '../../services/category_service/category_service';
import { AnalyticsService } from '../../services/analytics_service/analytics_service';

interface IServiceProvider {
  analyticsService: AnalyticsService;
  engagementService: EngagementService;
  authService: AuthService;
  versionService: VersionService;
  notificationService: NotificationService;
  categoryService: CategoryService;
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
