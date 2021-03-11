import faker from 'faker/locale/en_US';
import { LaunchData } from './launch_data';
import { GitCommit } from './git_commit';
import { CreationDetails } from './creation_details';
import { ClusterStatus } from './cluster_status';
import { EngagementCategory } from './engagement_category';
import { HostingEnvironment } from './hosting_environment';

export enum EngagementStatus {
  active = 'active',
  past = 'past',
  upcoming = 'upcoming',
  terminating = 'terminating',
}

export interface EngagementUser {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  uuid: string;
  reset?: boolean;
}
export abstract class EngagementUser {
  static fromFake(staticData = false): EngagementUser {
    return {
      first_name: staticData ? 'John' : faker.name.firstName(),
      last_name: staticData ? 'Doe' : faker.name.lastName(),
      email: staticData ? 'jdoe@doe.co' : faker.internet.exampleEmail(),
      role: 'developer',
      uuid: staticData ? '123' : faker.random.uuid(),
      reset: false,
    };
  }
}

export interface FakedEngagementOptions {
  uniqueSuffix: string;
  status: EngagementStatus;
}

export interface EngagementUseCase {
  description?: string;
  id: string;
}

export interface Artifact {
  id: string;
  linkAddress: string;
  title: string;
  type: string;
  description: string;
}

export abstract class Artifact {
  static fromFake(staticData = false): Artifact {
    return {
      id: staticData ? '1' : faker.random.uuid(),
      linkAddress: staticData ? 'https://example.com' : faker.internet.url(),
      title: staticData ? 'An engagement artifact' : faker.lorem.words(3),
      type: 'demo',
      description: staticData
        ? 'Artifact Description'
        : faker.lorem.paragraph(),
    };
  }
}

export interface EngagementOverview {
  additional_details: string;
  use_cases: EngagementUseCase[];
  location: string;
  project_id: number;
  project_name: string;
  customer_name: string;
  engagement_type: string;
  description: string;
  public_reference: boolean;
  engagement_categories: EngagementCategory[];
  engagement_region: string;
  timezone?: string;
}

export interface EngagementHistory {
  commits: GitCommit[];
  last_update_by_name: string;
  last_update: string;
}

export interface EngagementDates {
  start_date: Date;
  end_date: Date;
  archive_date: Date;
}

export interface EngagementContacts {
  engagement_lead_email: string;
  engagement_lead_name: string;
  technical_lead_email: string;
  technical_lead_name: string;
  customer_contact_email: string;
  customer_contact_name: string;
}

export interface EngagementState {
  status: ClusterStatus;
  launch?: LaunchData;
  creation_details: CreationDetails;
  mongo_id: string;
}
export interface Engagement
  extends EngagementOverview,
    EngagementState,
    EngagementDates,
    EngagementContacts,
    EngagementHistory {
  artifacts: Artifact[];
  engagement_users: EngagementUser[];
  hosting_environments: Partial<HostingEnvironment>[];
  uuid?: string;
}

const regions = ['emea', 'latam', 'na', 'apac'];
export abstract class Engagement {
  static equals(a?: Engagement, b?: Engagement): boolean {
    return (
      a?.uuid === b?.uuid ||
      (a?.customer_name === b?.customer_name &&
        a?.project_name === b?.customer_name)
    );
  }
  static areDatesValid = (start?: Date, end?: Date, archive?: Date) => {
    if (!start || !end || !archive) {
      return false;
    }
    if (end < start) {
      return false;
    }
    if (archive < end) {
      return false;
    }
    return true;
  };
  static fromFake(
    staticData = false,
    options: Partial<FakedEngagementOptions> = {}
  ): Engagement {
    const getStatusDeterminers = (): Pick<
      Engagement,
      'start_date' | 'end_date' | 'archive_date' | 'launch'
    > => {
      const defaults = {
        archive_date: staticData ? new Date(2020, 6, 30) : faker.date.future(),
        end_date: staticData ? new Date(2020, 6, 1) : faker.date.future(),
        start_date: staticData ? new Date(2020, 5, 1) : faker.date.recent(),
      };
      if (!options?.status) {
        return defaults;
      }
      switch (options?.status) {
        case EngagementStatus.active:
          return {
            start_date: new Date(Date.UTC(2020, 1, 1).valueOf()),
            end_date: new Date(Date.UTC(2098, 1, 1).valueOf()),
            archive_date: new Date(Date.UTC(2099, 1, 1).valueOf()),
            launch: {
              launched_by: 'A random person',
              launched_date_time: new Date(2020, 2, 1),
            },
          };
        case EngagementStatus.past:
          return {
            start_date: new Date(Date.UTC(2020, 1, 1).valueOf()),
            end_date: new Date(Date.UTC(2020, 2, 1).valueOf()),
            archive_date: new Date(Date.UTC(2020, 2, 2).valueOf()),
            launch: {
              launched_by: 'A random person',
              launched_date_time: new Date(2020, 3, 1),
            },
          };
        case EngagementStatus.upcoming:
          return {
            start_date: new Date(Date.UTC(2098, 1, 1).valueOf()),
            end_date: new Date(Date.UTC(2099, 1, 1).valueOf()),
            archive_date: new Date(Date.UTC(2099, 1, 2).valueOf()),
          };
        default:
          return defaults;
      }
    };
    return {
      additional_details: staticData
        ? 'Additional information here'
        : faker.lorem.paragraphs(2),
      artifacts: [Artifact.fromFake(staticData)],
      commits: [GitCommit.fromFake(staticData)],
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
      engagement_users: [EngagementUser.fromFake(staticData)],
      engagement_lead_email: staticData
        ? 'alice@doe.com'
        : faker.internet.email(),
      engagement_lead_name: staticData
        ? 'Alice Doe'
        : `${faker.name.firstName()} ${faker.name.lastName()}`,
      engagement_type: 'Residency',
      last_update: staticData ? '2020-01-01' : new Date().toString(),
      location: staticData
        ? 'Nashville, TN'
        : `${faker.address.city()}, ${faker.address.stateAbbr()}`,
      mongo_id: '1',
      hosting_environments: [HostingEnvironment.fromFake(staticData)],
      project_id: staticData ? 1 : faker.random.number(),
      project_name: staticData
        ? `Boots on the Moon${
            options?.uniqueSuffix ? ` ${options.uniqueSuffix}` : ''
          }`
        : faker.company.bsNoun(),
      public_reference: staticData ? false : faker.random.boolean(),
      engagement_region: regions[0],
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
      engagement_categories: [EngagementCategory.fromFake(staticData)],
      launch: staticData
        ? null
        : faker.random.boolean()
        ? {
            launched_by: faker.name.firstName(),
            launched_date_time: faker.date.recent(),
          }
        : null,
      status: ClusterStatus.fromFake(staticData, options),
      use_cases: staticData
        ? [{ id: '1', description: 'an engagement use case' }]
        : new Array(3).fill(null).map(() => ({
            description: faker.lorem.sentence(),
            id: faker.random.uuid().toString(),
          })),
      ...getStatusDeterminers(),
      uuid: staticData ? 'uuid' : faker.random.uuid(),
      timezone: 'Americas/Denver',
    };
  }
}

export const getEngagementStatus = (
  engagement: Partial<Engagement>
): EngagementStatus => {
  if (!engagement) {
    return null;
  }
  const Today = new Date();
  const { launch, end_date, archive_date } = engagement;
  const hasLaunched = !!launch?.launched_date_time;
  if (hasLaunched && end_date >= Today) {
    return EngagementStatus.active;
  } else if (hasLaunched && end_date < Today && archive_date > Today) {
    return EngagementStatus.terminating;
  } else if (hasLaunched && end_date < Today) {
    return EngagementStatus.past;
  } else {
    return EngagementStatus.upcoming;
  }
};
