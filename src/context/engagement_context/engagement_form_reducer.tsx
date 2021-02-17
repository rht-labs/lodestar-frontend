import { addDays } from 'date-fns';
import { Engagement } from '../../schemas/engagement';
import { EngagementFormConfig } from '../../schemas/engagement_config';

function normalizeDates(
  engagementFormConfig: EngagementFormConfig,
  currentEngagement: Partial<Engagement>,
  state: Partial<Engagement>
): Partial<Engagement> {
  const getArchiveDate = (
    archiveDate?: Date,
    savedArchiveDate?: Date,
    endDate?: Date,
    gracePeriod?: number
  ): Date => {
    if (archiveDate && endDate) {
      if (archiveDate < endDate) {
        archiveDate = endDate;
      }
      return archiveDate;
    } else if (
      (!archiveDate && !!endDate && !!gracePeriod) ||
      (!archiveDate && !savedArchiveDate && !!endDate)
    ) {
      console.log(archiveDate);
      return addDays(endDate, gracePeriod);
    }
    return archiveDate;
  };
  return {
    ...state,
    archive_date: getArchiveDate(
      state.archive_date,
      currentEngagement?.archive_date,
      state.end_date,
      engagementFormConfig?.logistics_options?.env_default_grace_period
    ),
  };
}
export const engagementFormReducer = (
  engagementFormConfig: EngagementFormConfig,
  currentEngagement: Partial<Engagement>
) => (
  state: Partial<Engagement> = {},
  action?: { type: string; payload?: any }
): Partial<Engagement> => {
  // const curriedDateNormalizer = normalizeEngagementDates(
  //   engagementFormConfig?.logistics_options?.env_default_grace_period,
  //   engagementFormConfig?.logistics_options?.env_grace_period_max
  // );
  if (!action) {
    return state;
  }
  switch (action.type) {
    case 'start_date':
    case 'end_date':
    case 'archive_date':
      const { end_date, start_date, archive_date } = state;
      return {
        ...state,
        ...normalizeDates(engagementFormConfig, currentEngagement, {
          start_date,
          end_date,
          archive_date,
          // overwrite the current field that's being changed with the payload value
          [action.type]: action.payload,
        }),
      };
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

// function normalizeEngagementDates(gracePeriodInDays, maxGracePeriodInDays) {
//   return function({
//     start_date,
//     end_date,
//     archive_date,
//   }: Partial<Pick<Engagement, 'start_date' | 'end_date' | 'archive_date'>>) {
//     let normalizedEndDate = normalizeEndDate(end_date, start_date);
//     const normalizedArchiveDate = normalizeRetirementDate({
//       retirementDate: archive_date,
//       endDate: normalizedEndDate,
//       gracePeriodInDays,
//       maxGracePeriodInDays,
//     });

//     const dates: Partial<Pick<
//       Engagement,
//       'start_date' | 'end_date' | 'archive_date'
//     >> = {};
//     dates.start_date = start_date;
//     dates.end_date = normalizedEndDate;
//     dates.archive_date = normalizedArchiveDate;
//     return dates;
//   };
// }

// function normalizeEndDate(endDate?: Date, startDate?: Date): Date {
//   if (!endDate) {
//     return undefined;
//   }
//   if (endDate < startDate) {
//     return startDate;
//   }
//   return endDate;
// }

// function normalizeRetirementDate({
//   retirementDate,
//   endDate,
//   gracePeriodInDays,
//   maxGracePeriodInDays,
// }) {
//   if (!endDate || !(endDate instanceof Date)) {
//     return undefined;
//   } else if (endDate && retirementDate && retirementDate <= endDate) {
//     return addDays(endDate, gracePeriodInDays);
//   } else if (
//     retirementDate &&
//     endDate &&
//     retirementDate >= addDays(endDate, maxGracePeriodInDays)
//   ) {
//     return addDays(endDate, maxGracePeriodInDays);
//   } else if (retirementDate) {
//     return retirementDate;
//   } else if (endDate) {
//     return addDays(endDate, gracePeriodInDays);
//   }
//   return startOfToday();
// }
