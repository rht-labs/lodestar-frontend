import React, { createContext, useState, useCallback, useContext } from 'react';
import { Engagement } from '../models/engagement';
import { FakedEngagementRepository } from '../repositories/engagement/implementations/faked_engagement_repository';
import { ConfigContext } from './config_context';
import { SessionContext } from './session_context';

export interface EngagementContext {
  getEngagements: () => void;
  engagements: Engagement[];
  createEngagement: (data: any) => Promise<void>;
}

export const EngagementContext = createContext<EngagementContext>({
  getEngagements: async () => [],
  engagements: [],
  createEngagement: async () => {},
});
const { Provider } = EngagementContext;

export const EngagementProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const configContext = useContext(ConfigContext);
  const sessionContext = useContext(SessionContext);
  const engagementRepository = new FakedEngagementRepository({
    baseUrl: configContext.appConfig?.backendUrl,
    axios: sessionContext.axios,
  });

  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const fetchEngagements = useCallback(async () => {
    const engagements = await engagementRepository.fetchEngagements();
    setEngagements(engagements);
  }, [engagementRepository]);

  const createEngagement = useCallback(
    async (data: any) => {
      engagementRepository.createEngagement(data);
    },
    [engagementRepository]
  );

  return (
    <Provider
      value={{
        engagements,
        getEngagements: fetchEngagements,
        createEngagement,
      }}
    >
      {children}
    </Provider>
  );
};
