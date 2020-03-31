import React, { createContext, useEffect, useState, useCallback } from 'react';
import { Engagement } from '../models/engagement';
import { EngagementRepository } from '../repositories/engagement/engagement_repository';

export interface EngagementContext {
  getEngagements: () => void;
  engagements: Engagement[];
}

export const EngagementContext = createContext<EngagementContext>({
  getEngagements: async () => [],
  engagements: [],
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

  const fetchEngagements = useCallback(async () => {
    const engagements = await engagementRepository.fetchEngagements();
    setEngagements(engagements);
  }, [engagementRepository]);

  useEffect(() => {
    fetchEngagements();
  }, [fetchEngagements]);

  return (
    <Provider
      value={{
        engagements,
        getEngagements: fetchEngagements,
      }}
    >
      {children}
    </Provider>
  );
};
