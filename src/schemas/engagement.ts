import faker from 'faker/locale/en_US';
import { LaunchData } from './launch_data';
import { GitCommit } from './git_commit';
import { CreationDetails } from './creation_details';
import { ClusterStatus } from './cluster_status';

export enum EngagementStatus {
  active = 'active',
  past = 'past',
  upcoming = 'upcoming',
}

export interface FakedEngagementOptions {
  status: EngagementStatus;
}
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
  static fromFake(
    staticData = false,
    options: Partial<FakedEngagementOptions> = {}
  ): Engagement {
    const getEngagementDates = (): Pick<
      Engagement,
      'start_date' | 'end_date' | 'archive_date'
    > => {
      const defaults = {
        archive_date: staticData ? new Date(2020, 6, 30) : faker.date.recent(),
        end_date: staticData ? new Date(2020, 6, 1) : faker.date.future(),
        start_date: staticData ? new Date(2020, 5, 1) : faker.date.recent(),
      };
      if (!options?.status) {
        return defaults;
      }
      switch (options?.status) {
        case EngagementStatus.active:
          return {
            start_date: new Date(2020, 1, 1),
            end_date: new Date(2098, 1, 1),
            archive_date: new Date(2099, 1, 1),
          };
        case EngagementStatus.past:
          return {
            start_date: new Date(2020, 1, 1),
            end_date: new Date(2020, 2, 1),
            archive_date: new Date(2020, 2, 2),
          };
        case EngagementStatus.upcoming:
          return {
            start_date: new Date(2098, 1, 1),
            end_date: new Date(2099, 1, 1),
            archive_date: new Date(2099, 1, 2),
          };
        default:
          return defaults;
      }
    };
    const dates = getEngagementDates();
    return {
      ...dates,
      additional_details: staticData
        ? 'Additional information here'
        : faker.lorem.paragraphs(2),
      commits: [],
      customer_contact_email: staticData
        ? 'bob@doe.com'
        : faker.internet.email(),
      customer_contact_name: staticData
        ? 'Bob Doe'
        : `${faker.name.firstName()} ${faker.name.lastName()}`,
      customer_name: staticData ? 'NASA' : faker.company.companyName(),
      description: staticData
        ? "It's rocket science"
        : faker.lorem.paragraphs(5),
      engagement_users: staticData ? [] : [],
      engagement_lead_email: staticData
        ? 'alice@doe.com'
        : faker.internet.email(),
      engagement_lead_name: staticData
        ? 'Alice Doe'
        : `${faker.name.firstName()} ${faker.name.lastName()}`,
      last_update: staticData ? '2020-01-01' : new Date().toString(),
      location: staticData
        ? 'Nashville, TN'
        : `${faker.address.city()}, ${faker.address.stateAbbr()}`,
      mongo_id: '1',
      ocp_cloud_provider_name: staticData ? 'AWS' : 'AWS',
      ocp_cloud_provider_region: staticData
        ? 'N. Virginia'
        : faker.lorem.word(),
      ocp_cluster_size: staticData ? 'Large' : 'Large',
      ocp_persistent_storage_size: staticData
        ? '100G'
        : `${faker.random.number()}G`,
      ocp_sub_domain: staticData ? 'ordoabchao' : faker.lorem.word(),
      ocp_version: staticData ? '4.4' : faker.random.number().toString(),
      project_id: staticData ? 1 : faker.random.number(),
      project_name: staticData ? 'Boots on the Moon' : faker.company.bsNoun(),
      technical_lead_email: staticData ? 'eve@doe.com' : faker.internet.email(),
      technical_lead_name: staticData
        ? 'Eve Doe'
        : `${faker.name.firstName()} ${faker.name.lastName()}`,
      creation_details: staticData
        ? {
            created_by_email: 'dwasinger@redhat.com',
            created_by_user: 'dwasinge',
            created_on: new Date(2020, 1, 1),
          }
        : {
            created_by_email: faker.internet.email(),
            created_by_user: `${faker.name.firstName()} ${faker.name.lastName()}`,
            created_on: faker.date.recent(),
          },
      last_update_by_name: staticData
        ? 'James Doe'
        : `${faker.name.firstName()} ${faker.name.lastName()}`,
      launch: staticData
        ? null
        : faker.random.boolean()
        ? {
            launched_by: faker.name.firstName(),
            launched_date_time: faker.date.recent(),
          }
        : null,
      status: ClusterStatus.fromFake(staticData),
    };
  }
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
