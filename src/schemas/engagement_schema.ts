import faker from 'faker/locale/en_US';

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
  suggested_subdomain?: string;
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
      archive_date: faker.date.recent().toISOString(),
      customer_contact_email: faker.internet.email(),
      customer_contact_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      customer_name: faker.company.companyName(),
      description: faker.lorem.paragraph(),
      end_date: faker.date.future().toISOString(),
      engagement_users: [],
      engagement_lead_email: faker.internet.email(),
      engagement_lead_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      location: `${faker.address.city()}, ${faker.address.stateAbbr()}`,
      ocp_cloud_provider_name: 'AWS',
      ocp_cloud_provider_region: faker.lorem.word(),
      ocp_cluster_size: 'Large',
      ocp_persistent_storage_size: `${faker.random.number()}G`,
      ocp_sub_domain: faker.lorem.word(),
      ocp_version: faker.random.number().toString(),
      project_id: faker.random.number(),
      project_name: faker.company.bsNoun(),
      start_date: faker.date.recent().toISOString(),
      technical_lead_email: faker.internet.email(),
      technical_lead_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      launch: {},
    });
  }
}
