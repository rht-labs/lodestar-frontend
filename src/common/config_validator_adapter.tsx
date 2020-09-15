import { ValidatorFactory } from '../schemas/validators';
import { EngagementFormConfig } from '../schemas/engagement_config';

export const getValidatorsFromEngagementFormConfig = (
  engagementFormConfig: EngagementFormConfig = null
) =>
  Object.keys(engagementFormConfig || {}).reduce(
    (previousSchemaGroups, currentGroupKey) => {
      return {
        ...previousSchemaGroups,
        ...Object.keys(engagementFormConfig[currentGroupKey] ?? {}).reduce(
          (previousGroupFields, currentFieldKey) => ({
            ...previousGroupFields,
            [currentFieldKey]: (
              engagementFormConfig?.[currentGroupKey]?.[currentFieldKey]
                ?.validators || []
            ).map(ValidatorFactory),
          }),
          {}
        ),
      };
    },
    {}
  );
