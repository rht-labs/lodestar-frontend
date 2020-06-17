import { ValidatorFactory } from '../schemas/validators';
import { EngagementFormConfig } from '../schemas/engagement_config';

export const getValidatorsFromFormOptions = (
  formOptions: EngagementFormConfig = {}
) =>
  Object.keys(formOptions || {}).reduce((acc, groupingKey) => {
    return {
      ...acc,
      ...Object.keys(formOptions[groupingKey] ?? {}).reduce(
        (acc, k) => ({
          ...acc,
          [k]: (formOptions?.[groupingKey]?.[k]?.validators || []).map(
            ValidatorFactory
          ),
        }),
        {}
      ),
    };
  }, {});
