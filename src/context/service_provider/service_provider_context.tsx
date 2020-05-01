import React, { useContext } from 'react';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import { AuthService } from '../../services/authentication_service/authentication_service';
import { VersionService } from '../../services/version_service/version_service';
import { Apiv1VersionService } from '../../services/version_service/implementations/apiv1_version_service';
import { Apiv1EngagementService } from '../../services/engagement_service/implementations/apiv1_engagement_service';
import { Apiv1AuthService } from '../../services/authentication_service/implementations/apiv1_auth_service';
import { FakedAuthService } from '../../services/authentication_service/implementations/faked_auth_service';
import { Config } from '../../schemas/config';
import { FakedEngagementService } from '../../services/engagement_service/implementations/faked_engagement_service';
import { ConfigContext } from '../config_context/config_context';

interface ServiceProvider {
  engagementService: EngagementService;
  authenticationService: AuthService;
  versionService: VersionService;
}

const ProductionServiceProviders = (config: Config) => ({
  engagementService: new Apiv1EngagementService(config.backendUrl),
  authenticationService: new Apiv1AuthService(config),
  versionService: new Apiv1VersionService(config.baseUrl),
});

const FakedServiceProviders = (config: Config) => ({
  engagementService: new FakedEngagementService(),
  authenticationService: new FakedAuthService(),
  versionService: new Apiv1VersionService(config.baseUrl),
});

export const ServiceProviderContext = React.createContext<ServiceProvider>({
  authenticationService: null,
  engagementService: null,
  versionService: null,
});

export const ServiceProvider = ({ children }: { children: any }) => {
  const configContext = useContext(ConfigContext);
  return (
    <ServiceProviderContext.Provider
      value={ProductionServiceProviders(configContext.appConfig)}
    >
      {children}
    </ServiceProviderContext.Provider>
  );
};
