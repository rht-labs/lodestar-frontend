import { Engagement } from '../../schemas/engagement_schema';
import { slugify } from 'transliteration';
const generateSuggestedSubdomain = (
  project_name: string = '',
  customer_name: string = ''
): string => {
  let slug = '';
  const maxLen = 8;
  if (project_name.length > 2) {
    slug = project_name;
  } else if (customer_name.length > 2) {
    slug = customer_name;
  }
  if (slug.length > maxLen && slug.substring(0, maxLen).includes(' ')) {
    slug = slug.substr(0, slug.lastIndexOf(' ', maxLen));
  }
  slug = slugify(slug.substring(0, maxLen));
  return slug;
};

const getInitialSubdomain = (engagement: Engagement) =>
  engagement?.project_name || engagement?.customer_name
    ? generateSuggestedSubdomain(
        engagement?.project_name,
        engagement?.customer_name
      )
    : null;

export const getInitialState = (engagement?: Engagement): Engagement => {
  return {
    project_id: engagement?.project_id ?? null,
    customer_name: engagement?.customer_name ?? null,
    project_name: engagement?.project_name ?? null,
    description: engagement?.description ?? null,
    location: engagement?.location ?? null,
    start_date: engagement?.start_date ?? null,
    end_date: engagement?.end_date ?? null,
    launch: engagement?.launch ?? undefined,
    archive_date: engagement?.archive_date ?? null,
    engagement_users: engagement?.engagement_users ?? [],
    mongo_id: engagement?.mongo_id ?? undefined,
    engagement_lead_name: engagement?.engagement_lead_name ?? null,
    engagement_lead_email: engagement?.engagement_lead_email ?? null,
    technical_lead_name: engagement?.technical_lead_name ?? null,
    technical_lead_email: engagement?.technical_lead_email ?? null,
    customer_contact_name: engagement?.customer_contact_name ?? null,
    customer_contact_email: engagement?.customer_contact_email ?? null,
    ocp_cloud_provider_name: engagement?.ocp_cloud_provider_name ?? null,
    ocp_cloud_provider_region: engagement?.ocp_cloud_provider_region ?? null,
    ocp_version: engagement?.ocp_version ?? null,
    ocp_sub_domain:
      engagement?.ocp_sub_domain ?? getInitialSubdomain(engagement) ?? null,
    ocp_persistent_storage_size:
      engagement?.ocp_persistent_storage_size ?? null,
    ocp_cluster_size: engagement?.ocp_cluster_size ?? null,
    suggested_subdomain:
      engagement?.project_name || engagement?.customer_name
        ? generateSuggestedSubdomain(
            engagement?.project_name,
            engagement?.customer_name
          )
        : null,
  };
};

export const engagementFormReducer = (
  state: Engagement = getInitialState(),
  action?: { type: string; payload?: any }
) => {
  if (!action) {
    return state;
  }
  switch (action.type) {
    case 'user':
      return { ...state, engagement_users: action.payload };
    case 'customer_name':
      return {
        ...state,
        customer_name: action.payload,
        suggested_subdomain: generateSuggestedSubdomain(
          state?.project_name ?? '',
          action.payload
        ),
      };
    case 'project_name':
      return {
        ...state,
        project_name: action.payload,
        suggested_subdomain: generateSuggestedSubdomain(
          action.payload,
          state?.customer_name ?? ''
        ),
      };
    case 'description':
      return { ...state, description: action.payload };
    case 'location':
      return { ...state, location: action.payload };
    case 'start_date':
      return { ...state, start_date: action.payload };
    case 'end_date':
      return { ...state, end_date: action.payload };
    case 'archive_date':
      return { ...state, archive_date: action.payload };
    case 'engagement_lead_name':
      return { ...state, engagement_lead_name: action.payload };
    case 'engagement_lead_email':
      return { ...state, engagement_lead_email: action.payload };
    case 'technical_lead_name':
      return { ...state, technical_lead_name: action.payload };
    case 'technical_lead_email':
      return { ...state, technical_lead_email: action.payload };
    case 'customer_contact_name':
      return { ...state, customer_contact_name: action.payload };
    case 'customer_contact_email':
      return { ...state, customer_contact_email: action.payload };
    case 'ocp_cloud_provider_name':
      return { ...state, ocp_cloud_provider_name: action.payload };
    case 'ocp_cloud_provider_region':
      return { ...state, ocp_cloud_provider_region: action.payload };
    case 'ocp_version':
      return { ...state, ocp_version: action.payload };
    case 'ocp_sub_domain':
      return { ...state, ocp_sub_domain: action.payload };
    case 'ocp_persistent_storage_size':
      return { ...state, ocp_persistent_storage_size: action.payload };
    case 'ocp_cluster_size':
      return { ...state, ocp_cluster_size: action.payload };
    case 'switch_engagement':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
