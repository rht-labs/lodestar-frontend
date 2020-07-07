import { ValidatorFactory } from '../schemas/validators';
import { EngagementFormConfig } from '../schemas/engagement_config';

export const getValidatorsFromFormOptions = (
  formOptions: EngagementFormConfig = {}
) =>
  Object.keys(formOptions || {}).reduce(
    (previousSchemaGroups, currentGroupKey) => {
      return {
        ...previousSchemaGroups,
        ...Object.keys(formOptions[currentGroupKey] ?? {}).reduce(
          (previousGroupFields, currentFieldKey) => ({
            ...previousGroupFields,
            [currentFieldKey]: (
              formOptions?.[currentGroupKey]?.[currentFieldKey]?.validators ||
              []
            ).map(ValidatorFactory),
          }),
          {}
        ),
      };
    },
    {}
  );
