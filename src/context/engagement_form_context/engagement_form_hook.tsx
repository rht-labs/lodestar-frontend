import { useContext } from 'react';
import { EngagementFormContext } from './engagement_form_context';

export const useEngagementForm = () => useContext(EngagementFormContext);
