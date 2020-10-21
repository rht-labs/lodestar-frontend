import FakedSchema from './fixtures/engagement_form_config.json';

export interface EngagementFormOption {
  label: string;
  value: string;
  description?: string;
  default?: boolean;
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

export interface EngagementFormBasicInformation {
  engagement_types: FormConfig;
  engagement_regions: FormConfig;
  project_name: FormConfig;
  customer_name: FormConfig;
}

export interface EngagementFormCloudOptions {
  providers: FormConfig;
}

export interface EngagementFormOpenshiftOptions {
  versions: FormConfig;
  persistent_storage: FormConfig;
  cluster_size: FormConfig;
}

export interface EngagementFormUserOptions {
  user_roles: FormConfig;
}

export interface EngagementFormLogisticsOptions {
  start_date: FormConfig;
  end_date: FormConfig;
  technical_contact_email: FormConfig;
  env_default_grace_period: number;
  env_grace_period_max: number;
}
export interface EngagementFormConfig {
  basic_information: EngagementFormBasicInformation;
  cloud_options: EngagementFormCloudOptions;
  openshift_options: EngagementFormOpenshiftOptions;
  user_options: EngagementFormUserOptions;
  logistics_options: EngagementFormLogisticsOptions;
}

export abstract class EngagementFormConfig {
  static fromFake(): EngagementFormConfig {
    return FakedSchema;
  }
}
