import React, { useContext } from 'react';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import { AuthService } from '../../services/auth_service/authentication_service';
import { VersionService } from '../../services/version_service/version_service';
import { NotificationService } from '../../services/notification_service/notification_service';
import { ServiceFactory } from '../../services/factories/service_factory';

interface ServiceProvider {
  engagementService: EngagementService;
  authService: AuthService;
  versionService: VersionService;
  notificationService: NotificationService;
}

export const ServiceProviderContext = React.createContext<ServiceProvider>(
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
  const services: ServiceProvider = serviceFactory();
  return (
    <ServiceProviderContext.Provider value={services}>
      {children}
    </ServiceProviderContext.Provider>
  );
};

export const useServiceProviders = () => useContext(ServiceProviderContext);
