import faker from 'faker';

export interface Engagement {
  archive_date: string;
  customer_contact_email: string;
  customer_contact_name: string;
  customer_name: string;
  description: string;
  end_date: string;
  engagement_lead_email: string;
  engagement_lead_name: string;
  engagement_users: Array<any>;
  location: string;
  mongo_id?: string;
  ocp_cloud_provider_name: string;
  ocp_cloud_provider_region: string;
  ocp_cluster_size: string;
  ocp_persistent_storage_size: string;
  ocp_sub_domain: string;
  ocp_version: string;
  project_id: number;
  project_name: string;
  start_date: string;
  technical_lead_email: string;
  technical_lead_name: string;
  launch: object;
}
export class Engagement {
  constructor(engagement: Engagement) {
    this.archive_date = engagement.archive_date;
    this.customer_contact_email = engagement.customer_contact_email;
    this.customer_contact_name = engagement.customer_contact_name;
    this.customer_name = engagement.customer_name;
    this.description = engagement.description;
    this.end_date = engagement.end_date;
    this.engagement_users = engagement.engagement_users ?? [];
    this.engagement_lead_email = engagement.engagement_lead_email;
    this.engagement_lead_name = engagement.engagement_lead_name;
    this.location = engagement.location;
    this.mongo_id = engagement.mongo_id;
    this.ocp_cloud_provider_name = engagement.ocp_cloud_provider_name;
    this.ocp_cloud_provider_region = engagement.ocp_cloud_provider_region;
    this.ocp_cluster_size = engagement.ocp_cluster_size;
    this.ocp_persistent_storage_size = engagement.ocp_persistent_storage_size;
    this.ocp_sub_domain = engagement.ocp_sub_domain;
    this.ocp_version = engagement.ocp_version;
    this.project_id = engagement.project_id;
    this.project_name = engagement.project_name;
    this.start_date = engagement.start_date;
    this.technical_lead_email = engagement.technical_lead_email;
    this.technical_lead_name = engagement.technical_lead_name;
    this.launch = engagement.launch;
  }
  archive_date: string;
  customer_contact_email: string;
  customer_contact_name: string;
  customer_name: string;
  description: string;
  end_date: string;
  engagement_lead_email: string;
  engagement_lead_name: string;
  location: string;
  engagement_users: Array<any>;
  mongo_id?: string;
  ocp_cloud_provider_name: string;
  ocp_cloud_provider_region: string;
  ocp_cluster_size: string;
  ocp_persistent_storage_size: string;
  ocp_sub_domain: string;
  ocp_version: string;
  project_id: number;
  project_name: string;
  start_date: string;
  technical_lead_email: string;
  technical_lead_name: string;
  launch: object;

  static fromFake() {
    return new Engagement({
      archive_date: faker.lorem.word(),
      customer_contact_email: faker.lorem.word(),
      customer_contact_name: faker.lorem.word(),
      customer_name: faker.lorem.word(),
      description: faker.lorem.word(),
      end_date: faker.lorem.word(),
      engagement_users: [],
      engagement_lead_email: faker.lorem.word(),
      engagement_lead_name: faker.lorem.word(),
      location: faker.lorem.word(),
      mongo_id: faker.random.uuid(),
      ocp_cloud_provider_name: faker.lorem.word(),
      ocp_cloud_provider_region: faker.lorem.word(),
      ocp_cluster_size: faker.lorem.word(),
      ocp_persistent_storage_size: faker.lorem.word(),
      ocp_sub_domain: faker.lorem.word(),
      ocp_version: faker.lorem.word(),
      project_id: faker.random.number(),
      project_name: faker.lorem.word(),
      start_date: faker.lorem.word(),
      technical_lead_email: faker.lorem.word(),
      technical_lead_name: faker.lorem.word(),
      launch: {},
    });
  }
}
