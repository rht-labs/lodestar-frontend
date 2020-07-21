import React, { useContext, useEffect } from 'react';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import { AuthService } from '../../services/auth_service/authentication_service';
import { VersionService } from '../../services/version_service/version_service';
import { Apiv1VersionService } from '../../services/version_service/implementations/apiv1_version_service';
import { FakedVersionService } from '../../services/version_service/implementations/faked_version_service';
import { Apiv1AuthService } from '../../services/auth_service/implementations/apiv1_auth_service';
import { FakedAuthService } from '../../services/auth_service/implementations/faked_auth_service';
import { Config } from '../../schemas/config';
import { FakedEngagementService } from '../../services/engagement_service/implementations/faked_engagement_service';
import { useConfig } from '../config_context/config_hook';
import { Apiv1EngagementService } from '../../services/engagement_service/implementations/apiv1_engagement_service';
import { NotificationService } from '../../services/notification_service/notification_service';
import { FakedNotificationService } from '../../services/notification_service/implementations/faked_notification_service';

interface ServiceProvider {
  engagementService: EngagementService;
  authenticationService: AuthService;
  versionService: VersionService;
  notificationService: NotificationService;
}

const ProductionServiceProviders = (config: Config) => {
  const authService = new Apiv1AuthService(config);
  return {
    engagementService: new Apiv1EngagementService(config.backendUrl),
    authenticationService: authService,
    versionService: new Apiv1VersionService(config.backendUrl),
    notificationService: new FakedNotificationService(),
  };
};

const FakedServiceProviders = (config?: Config | undefined) => ({
  engagementService: new FakedEngagementService(),
  authenticationService: new FakedAuthService(),
  versionService: new FakedVersionService(),
  notificationService: new FakedNotificationService(),
});

export const ServiceProviderContext = React.createContext<ServiceProvider>(
  FakedServiceProviders()
);

export const ServiceProvider = ({
  children,
  shouldUseFaked,
}: {
  children: any;
  shouldUseFaked?: boolean;
}) => {
  shouldUseFaked =
    shouldUseFaked === undefined
      ? process?.env?.['REACT_APP_USE_FAKED']?.toLowerCase() === 'true'
      : shouldUseFaked;

  const { appConfig, fetchConfig } = useConfig();

  useEffect(() => {
    if (!shouldUseFaked && !appConfig) {
      fetchConfig();
    }
  }, [shouldUseFaked, appConfig, fetchConfig]);

  if (!appConfig && !shouldUseFaked) {
    return null;
  }

  return (
    <ServiceProviderContext.Provider
      value={
        shouldUseFaked
          ? FakedServiceProviders(appConfig)
          : ProductionServiceProviders(appConfig)
      }
    >
      {children}
    </ServiceProviderContext.Provider>
  );
};

export const useServiceProviders = () => useContext(ServiceProviderContext);
