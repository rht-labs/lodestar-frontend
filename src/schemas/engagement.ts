import faker from 'faker/locale/en_US';
import { LaunchData } from './launch_data';
import { GitCommit } from './git_commit';
import { CreationDetails } from './creation_details';
import { ClusterStatus } from './cluster_status';
export interface Engagement {
  additional_details?: string;
  archive_date: Date;
  commits: GitCommit[];
  customer_contact_email: string;
  customer_contact_name: string;
  customer_name: string;
  description: string;
  end_date: Date;
  engagement_lead_email: string;
  engagement_lead_name: string;
  engagement_users: Array<any>;
  last_update: string;
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
  launch?: LaunchData;
  creation_details: CreationDetails;
  last_update_by_name: string;
  suggested_subdomain?: string;
  status: ClusterStatus;
}
export abstract class Engagement {
  static fromFake(): Engagement {
    return {
      additional_details: faker.lorem.paragraphs(2),
      archive_date: faker.date.recent(),
      commits: [],
      customer_contact_email: faker.internet.email(),
      customer_contact_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      customer_name: faker.company.companyName(),
      description: faker.lorem.paragraphs(5),
      end_date: faker.date.future(),
      engagement_users: [],
      engagement_lead_email: faker.internet.email(),
      engagement_lead_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      last_update: new Date().toString(),
      location: `${faker.address.city()}, ${faker.address.stateAbbr()}`,
      mongo_id: '1',
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
      creation_details: {
        created_by_email: faker.internet.email(),
        created_by_user: `${faker.name.firstName()} ${faker.name.lastName()}`,
        created_on: faker.date.recent(),
      },
      last_update_by_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      launch: faker.random.boolean()
        ? {
            launched_by: faker.name.firstName(),
            launched_date_time: faker.date.recent(),
          }
        : null,
      status: ClusterStatus.fromFake(),
    };
  }

  static staticFaked(): Engagement {
    return {
      additional_details: 'Additional information here',
      archive_date: new Date(),
      commits: [],
      customer_contact_email: 'bob@doe.com',
      customer_contact_name: `Bob Doe`,
      customer_name: 'NASA',
      description: "It's rocket science",
      end_date: new Date(2020, 6, 1),
      engagement_users: [],
      engagement_lead_email: 'alice@doe.com',
      engagement_lead_name: `Alice Doe`,
      last_update: '2020-01-01',
      location: `Nashville, TN`,
      ocp_cloud_provider_name: 'AWS',
      ocp_cloud_provider_region: 'N. Virginia',
      ocp_cluster_size: 'Large',
      ocp_persistent_storage_size: `100G`,
      ocp_sub_domain: 'ordoabchao',
      ocp_version: '4.4',
      project_id: 1,
      project_name: 'Boots on the Moon',
      start_date: new Date(2020, 5, 1),
      technical_lead_email: 'eve@doe.com',
      technical_lead_name: `Eve Doe`,
      launch: null,
      creation_details: {
        created_by_email: 'dwasinge@redhat.com',
        created_by_user: 'dwasinge',
        created_on: new Date(2020, 1, 1),
      },
      last_update_by_name: `James Doe`,
      status: ClusterStatus.staticFake(),
    };
  }
}

export enum EngagementStatus {
  active = 'active',
  past = 'past',
  upcoming = 'upcoming',
}

export const getEngagementStatus = (
  engagement: Engagement
): EngagementStatus => {
  if (!engagement) {
    return null;
  }
  const Today = new Date();
  const { launch, end_date } = engagement;
  const hasLaunched = !!launch?.launched_date_time;
  if (hasLaunched && end_date >= Today) {
    return EngagementStatus.active;
  } else if (hasLaunched && end_date < Today) {
    return EngagementStatus.past;
  } else {
    return EngagementStatus.upcoming;
  }
};
