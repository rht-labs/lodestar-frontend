import FakedSchema from './fixtures/engagement_form_config.json';

export interface EngagementFormOption {
  label: string;
  value: string;
  options?: EngagementFormOption[];
}

export interface EngagementFormValidator {
  kind: string;
  value?: any;
}

export interface FormConfig {
  options?: EngagementFormOption[];
  validators?: EngagementFormValidator[];
}

export interface EngagementFormConfig {
  [key: string]: { [key: string]: FormConfig };
}

export abstract class EngagementFormConfig {
  static fromFake(): EngagementFormConfig {
    return FakedSchema;
  }
}
