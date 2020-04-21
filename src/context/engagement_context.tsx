import React, { createContext, useState, useCallback, useContext } from 'react';
import { Engagement } from '../schemas/engagement_schema';
import { Apiv1EngagementService } from '../services/engagement_service/implementations/apiv1_engagement_service';
import { ConfigContext } from './config_context';
import { SessionContext } from './session_context';

export interface EngagementContext {
  getEngagements: () => void;
  activeEngagement?: Engagement;
  setActiveEngagement: (Engagement: Engagement) => void;
  engagements: Engagement[];
  createEngagement: (data: any) => Promise<void>;
}

export const EngagementContext = createContext<EngagementContext>({
  getEngagements: async () => [],
  activeEngagement: undefined,
  setActiveEngagement: (engagement: Engagement) => {},
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
  const engagementRepository = new Apiv1EngagementService({
    baseUrl: configContext.appConfig?.backendUrl,
    axios: sessionContext.axios,
  });

  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [activeEngagement, setActiveEngagement] = useState<
    Engagement | undefined
  >();
  const fetchEngagements = useCallback(async () => {
    const engagements = await engagementRepository.fetchEngagements();
    setEngagements(engagements);
    if (engagements.length > 0) {
      setActiveEngagement(engagements[0]);
    }
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
        activeEngagement,
        setActiveEngagement,
        engagements,
        getEngagements: fetchEngagements,
        createEngagement,
      }}
    >
      {children}
    </Provider>
  );
};
