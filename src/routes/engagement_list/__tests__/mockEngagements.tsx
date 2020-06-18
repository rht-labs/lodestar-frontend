import {Engagement} from "../../../schemas/engagement_schema";

export function upcomingEngagement(): Engagement {
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
    launch: null,
  };
}

export function activeEngagement(): Engagement {
  return {
    archive_date: new Date(),
    customer_contact_email: 'bob@doe.com',
    customer_contact_name: `Bob Doe`,
    customer_name: 'NASA',
    description: "It's rocket science",
    end_date: ( d => new Date(d.setDate(d.getDate()+1)) )(new Date),
    engagement_users: ['a', 'b', 'c'],
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
    start_date: ( d => new Date(d.setDate(d.getDate()-10)) )(new Date),
    technical_lead_email: 'eve@doe.com',
    technical_lead_name: `Eve Doe`,
    launch: new Date(),
  };
}

export function pastEngagement(): Engagement {
  return {
    archive_date: new Date(),
    customer_contact_email: 'bob@doe.com',
    customer_contact_name: `Bob Doe`,
    customer_name: 'NASA',
    description: "It's rocket science",
    end_date: ( d => new Date(d.setDate(d.getDate()-1)) )(new Date),
    engagement_users: ['1','2', '3', '1','2', '3'],
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
    start_date: ( d => new Date(d.setDate(d.getDate()-10)) )(new Date),
    technical_lead_email: 'eve@doe.com',
    technical_lead_name: `Eve Doe`,
    launch: new Date(),
  };
}
