import faker from 'faker/locale/en_US';

export interface Engagement {
  archive_date: Date;
  customer_contact_email: string;
  customer_contact_name: string;
  customer_name: string;
  description: string;
  end_date: Date;
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
  start_date: Date;
  technical_lead_email: string;
  technical_lead_name: string;
  launch: object;
  suggested_subdomain?: string;
}
export abstract class Engagement {
  static fromFake() {
    return {
      archive_date: faker.date.recent(),
      customer_contact_email: faker.internet.email(),
      customer_contact_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      customer_name: faker.company.companyName(),
      description: faker.lorem.paragraph(),
      end_date: faker.date.future(),
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
      start_date: faker.date.recent(),
      technical_lead_email: faker.internet.email(),
      technical_lead_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      launch: {},
    };
  }

  static staticFaked() {
    return {
      archive_date: new Date(),
      customer_contact_email: 'bob@doe.com',
      customer_contact_name: `Bob Doe`,
      customer_name: 'NASA',
      description: "It's rocket science",
      end_date: new Date(),
      engagement_users: [],
      engagement_lead_email: 'alice@doe.com',
      engagement_lead_name: `Alice Doe`,
      location: `Nashville, TN`,
      ocp_cloud_provider_name: 'AWS',
      ocp_cloud_provider_region: 'N. Virginia',
      ocp_cluster_size: 'Large',
      ocp_persistent_storage_size: `100G`,
      ocp_sub_domain: 'ordoabchao',
      ocp_version: '4.4',
      project_id: 1,
      project_name: 'Boots on the Moon',
      start_date: new Date(),
      technical_lead_email: 'eve@doe.com',
      technical_lead_name: `Eve Doe`,
      launch: {},
    };
  }
}
