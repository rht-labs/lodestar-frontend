export function getHumanReadableFieldName(field: string): string {
  const humanReadableFieldMap = {
    archive_date: 'Archive Date',
    commits: 'History',
    customer_contact_email: 'Customer Contact Email',
    customer_contact_name: 'Customer Contact Name',
    customer_name: 'Customer Name',
    description: 'Description',
    end_date: 'End Date',
    engagement_users: 'Engagement Users',
    engagement_lead_email: 'Engagement Lead Email',
    engagement_lead_name: `Engagement Lead Name`,
    location: `Location`,
    ocp_cloud_provider_name: 'Cloud Provider Name',
    ocp_cloud_provider_region: 'Cloud Provider Region',
    ocp_cluster_size: 'Cluster Size',
    ocp_persistent_storage_size: `Persistent Storage Size`,
    ocp_sub_domain: 'Subdomain',
    ocp_version: 'Cloud Provider Version',
    project_id: 'Project Id',
    project_name: 'Project Name',
    start_date: 'Start Date',
    technical_lead_email: 'Technical Lead Email',
    technical_lead_name: 'Technical Lead Name',
  };
  if (field in humanReadableFieldMap) {
    return humanReadableFieldMap[field];
  } else {
    return field;
  }
}
