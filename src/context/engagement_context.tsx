import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import { Engagement } from '../models/engagement';
import { EngagementRepository } from '../repositories/engagement/engagement_repository';
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
  engagementRepository,
}: {
  children: React.ReactChild;
  engagementRepository: EngagementRepository;
}) => {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const sessionContext = useContext(SessionContext);
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

  useEffect(() => {
    if (!sessionContext.isLoading) {
      console.log('firing engagement context effect');
      fetchEngagements();
    }
  }, [fetchEngagements, sessionContext]);

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
