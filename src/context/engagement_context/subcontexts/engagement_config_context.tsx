import React, { useCallback, useContext, useState } from 'react';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { EngagementAuthMediatorContext } from './engagement_auth_mediator';
import { EngagementService } from '../../../services/engagement_service/engagement_service';
export interface EngagementConfigContext {
  getConfig: () => void;
  engagementFormConfig?: EngagementFormConfig;
}

interface EngagementConfigContextProviderProps {
  children: any;
  engagementService: EngagementService;
}

export const EngagementConfigContext = React.createContext<
  EngagementConfigContext
>(null);

export const EngagementConfigContextProvider = ({
  children,
  engagementService,
}: EngagementConfigContextProviderProps) => {
  const [engagementFormConfig, setEngagementFormConfig] = useState<
    EngagementFormConfig
  >(undefined);
  const { validateAuthStatus } = useContext(EngagementAuthMediatorContext);
  const getConfig = useCallback(async () => {
    await validateAuthStatus();
    const data = await engagementService.getConfig();
    setEngagementFormConfig(data);
  }, [engagementService, validateAuthStatus]);
  return (
    <EngagementConfigContext.Provider
      value={{ getConfig, engagementFormConfig }}
    >
      {children}
    </EngagementConfigContext.Provider>
  );
};
