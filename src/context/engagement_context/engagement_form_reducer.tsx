import { Engagement } from '../../schemas/engagement';
import { slugify } from 'transliteration';
import { addDays, startOfToday } from 'date-fns';
import { EngagementFormConfig } from '../../schemas/engagement_config';
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

const getInitialSubdomain = (engagement: Partial<Engagement>) =>
  engagement?.project_name || engagement?.customer_name
    ? generateSuggestedSubdomain(
        engagement?.project_name,
        engagement?.customer_name
      )
    : null;

export const getInitialState = (
  engagement?: Partial<Engagement>
): Partial<Engagement> => {
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
    last_update: engagement?.last_update ?? '',
    last_update_by_name: engagement?.last_update_by_name ?? '',
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
    engagement_categories: engagement?.engagement_categories ?? [],
  };
};

export const engagementFormReducer = (
  engagementFormConfig: EngagementFormConfig
) => (
  state: Partial<Engagement> = getInitialState(),
  action?: { type: string; payload?: any }
) => {
  const curriedEngagementDatesFunction = getEngagementDates(
    engagementFormConfig?.logistics_options?.env_default_grace_period,
    engagementFormConfig?.logistics_options?.env_grace_period_max
  );
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
    case 'start_date':
    case 'end_date':
    case 'archive_date':
      const { end_date, start_date, archive_date } = state;
      return {
        ...state,
        ...curriedEngagementDatesFunction({
          start_date,
          end_date,
          archive_date,
          // overwrite the current field that's being changed with the payload value
          [action.type]: action.payload,
        }),
      };
    case 'additional_details':
    case 'description':
    case 'location':
    case 'engagement_lead_name':
    case 'engagement_lead_email':
    case 'technical_lead_name':
    case 'technical_lead_email':
    case 'customer_contact_name':
    case 'customer_contact_email':
    case 'ocp_cloud_provider_name':
    case 'ocp_cloud_provider_region':
    case 'ocp_version':
    case 'ocp_sub_domain':
    case 'ocp_persistent_storage_size':
    case 'engagement_categories':
    case 'ocp_cluster_size':
      return { ...state, [action.type]: action.payload };
    case 'switch_engagement':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

function getEngagementDates(gracePeriodInDays, maxGracePeriodInDays) {
  return function({
    start_date,
    end_date,
    archive_date,
  }: Pick<Engagement, 'start_date' | 'end_date' | 'archive_date'>) {
    let endDate = normalizeEndDate(end_date, start_date);
    return {
      start_date,
      end_date: endDate,
      archive_date: normalizeRetirementDate({
        retirementDate: archive_date,
        endDate,
        gracePeriodInDays,
        maxGracePeriodInDays,
      }),
    };
  };
}

function normalizeEndDate(endDate, startDate) {
  if (endDate < startDate) {
    return startDate;
  }
  return endDate;
}

function normalizeRetirementDate({
  retirementDate,
  endDate,
  gracePeriodInDays,
  maxGracePeriodInDays,
}) {
  if (!endDate || !(endDate instanceof Date)) {
    return undefined;
  } else if (endDate && retirementDate && retirementDate <= endDate) {
    return addDays(endDate, gracePeriodInDays);
  } else if (
    retirementDate &&
    endDate &&
    retirementDate >= addDays(endDate, maxGracePeriodInDays)
  ) {
    return addDays(endDate, maxGracePeriodInDays);
  } else if (retirementDate) {
    return retirementDate;
  } else if (endDate) {
    return addDays(endDate, gracePeriodInDays);
  }
  return startOfToday();
}
