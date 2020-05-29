export interface EngagementFormOption {
  label: string;
  value: string;
  options?: EngagementFormOption[];
}

export interface EngagementFormValidator {
  kind: string;
  value: any;
}

export interface FormConfig {
  options?: EngagementFormOption[];
  validators?: EngagementFormValidator[];
}

export type EngagementFormConfig = {
  [key: string]: { [key: string]: FormConfig };
};
