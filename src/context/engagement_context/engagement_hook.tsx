import { useContext } from 'react';

import { EngagementContext } from './engagement_context';

export const useEngagements = () => useContext(EngagementContext);
