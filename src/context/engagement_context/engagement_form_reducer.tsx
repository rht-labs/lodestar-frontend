import { Engagement } from '../../schemas/engagement';

export const engagementFormReducer = (
  state: Partial<Engagement> = {},
  action?: { type: string; payload?: any }
): Partial<Engagement> => {
  if (!action) {
    return state;
  }
  switch (action.type) {
    case 'start_date':
    case 'end_date':
    case 'archive_date':
    case 'customer_name':
    case 'project_name':
    case 'additional_details':
    case 'public_reference':
    case 'description':
    case 'location':
    case 'engagement_lead_name':
    case 'engagement_lead_email':
    case 'technical_lead_name':
    case 'technical_lead_email':
    case 'customer_contact_name':
    case 'engagement_users':
    case 'artifacts':
    case 'customer_contact_email':
    case 'use_cases':
    case 'ocp_persistent_storage_size':
    case 'engagement_categories':
    case 'timezone':
    case 'hosting_environments':
      return { ...state, [action.type]: action.payload };
    case 'switch_engagement':
      return action.payload ?? {};
    default:
      return state;
  }
};
