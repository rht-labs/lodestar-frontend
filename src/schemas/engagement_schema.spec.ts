import { Engagement } from './engagement_schema';

const engagementProperties = [
  'archive_date',
  'commits',
  'customer_contact_email',
  'customer_contact_name',
  'customer_name',
  'description',
  'end_date',
  'engagement_users',
  'engagement_lead_email',
  'engagement_lead_name',
  'location',
  'mongo_id',
  'ocp_cloud_provider_name',
  'ocp_cloud_provider_region',
  'ocp_cluster_size',
  'ocp_persistent_storage_size',
  'ocp_sub_domain',
  'ocp_version',
  'project_id',
  'project_name',
  'start_date',
  'technical_lead_email',
  'technical_lead_name',
  'launch',
];

describe('Engagement Schema', () => {
  test('Faked engagement schema has not changed', () => {
    expect(Object.keys(Engagement.fromFake()).sort()).toEqual(
      engagementProperties.sort()
    );
  });
});
