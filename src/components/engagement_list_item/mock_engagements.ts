import { Engagement } from '../../schemas/engagement';
import { HealthStatus } from '../../schemas/cluster_status';

export function upcomingEngagement(): Engagement {
  return {
    archive_date: new Date(),
    customer_contact_email: 'bob@doe.com',
    customer_contact_name: `Bob Doe`,
    customer_name: 'NASA',
    description: "It's rocket science",
    end_date: new Date(2050, 1, 3),
    engagement_users: [],
    engagement_lead_email: 'alice@doe.com',
    engagement_lead_name: `Alice Doe`,
    location: `Nashville, TN`,
    ocp_cloud_provider_name: 'AWS',
    ocp_cloud_provider_region: 'N. Virginia',
    ocp_cluster_size: 'Large',
    commits: [],
    creation_details: {
      created_by_email: 'john@doe.com',
      created_by_user: 'John Doe',
      created_on: new Date(2020, 1, 1),
    },
    status: {
      messages: [],
      overall_status: HealthStatus.green,
      subsystems: [],
    },
    ocp_persistent_storage_size: `100G`,
    ocp_sub_domain: 'ordoabchao',
    ocp_version: '4.4',
    project_id: 1,
    project_name: 'Boots on the Moon',
    start_date: new Date(2050, 1, 1),
    technical_lead_email: 'eve@doe.com',
    technical_lead_name: `Eve Doe`,
    launch: null,
  };
}

export function currentEngagement(): Engagement {
  return {
    archive_date: new Date(),
    customer_contact_email: 'bob@doe.com',
    customer_contact_name: `Bob Doe`,
    customer_name: 'NASA',
    description: "It's rocket science",
    end_date: new Date(2050, 1, 1),
    engagement_users: ['a', 'b', 'c'],
    engagement_lead_email: 'alice@doe.com',
    engagement_lead_name: `Alice Doe`,
    location: `Nashville, TN`,
    ocp_cloud_provider_name: 'AWS',
    ocp_cloud_provider_region: 'N. Virginia',
    ocp_cluster_size: 'Large',
    commits: [],
    creation_details: {
      created_by_email: 'john@doe.com',
      created_by_user: 'John Doe',
      created_on: new Date(2020, 1, 1),
    },
    status: {
      messages: [],
      overall_status: HealthStatus.green,
      subsystems: [],
    },
    ocp_persistent_storage_size: `100G`,
    ocp_sub_domain: 'ordoabchao',
    ocp_version: '4.4',
    project_id: 1,
    project_name: 'Boots on the Moon',
    start_date: new Date(2000, 1, 1),
    technical_lead_email: 'eve@doe.com',
    technical_lead_name: `Eve Doe`,
    launch: {
      launched_by: 'John Doe',
      launched_date_time: new Date(2020, 3, 21),
    },
  };
}

export function pastEngagement(): Engagement {
  return {
    archive_date: new Date(),
    customer_contact_email: 'bob@doe.com',
    customer_contact_name: `Bob Doe`,
    customer_name: 'NASA',
    description: "It's rocket science",
    end_date: new Date(2020, 1, 3),
    engagement_users: ['1', '2', '3', '1', '2', '3'],
    engagement_lead_email: 'alice@doe.com',
    engagement_lead_name: `Alice Doe`,
    location: `Nashville, TN`,
    ocp_cloud_provider_name: 'AWS',
    ocp_cloud_provider_region: 'N. Virginia',
    ocp_cluster_size: 'Large',
    commits: [],
    creation_details: {
      created_by_email: 'john@doe.com',
      created_by_user: 'John Doe',
      created_on: new Date(2020, 1, 1),
    },
    status: {
      messages: [],
      overall_status: HealthStatus.green,
      subsystems: [],
    },
    ocp_persistent_storage_size: `100G`,
    ocp_sub_domain: 'ordoabchao',
    ocp_version: '4.4',
    project_id: 1,
    project_name: 'Boots on the Moon',
    start_date: new Date(2020, 1, 1),
    technical_lead_email: 'eve@doe.com',
    technical_lead_name: `Eve Doe`,
    launch: {
      launched_by: 'John Doe',
      launched_date_time: new Date(2020, 1, 2),
    },
  };
}
