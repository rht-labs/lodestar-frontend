import { EngagementFormConfig } from '../schemas/engagement_config';
import FakedSchema from './engagement_form_config.json';

export const mockEngagementFormConfig = (): EngagementFormConfig => {
  return (FakedSchema as unknown) as EngagementFormConfig;
};
