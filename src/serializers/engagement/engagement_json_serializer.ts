import { Serializer } from '../serializer';
import { Engagement } from '../../schemas/engagement_schema';

export class EngagementJsonSerializer
  implements Serializer<Engagement, object> {
  serialize(engagement: Engagement): object {
    return {
      ...engagement,
    };
  }
  deserialize(data: object): Engagement {
    return {
      archive_date: data['archive_date'],
      customer_contact_email: data['customer_contact_email'],
      customer_contact_name: data['customer_contact_name'],
      customer_name: data['customer_name'],
      description: data['description'],
      end_date: new Date(Date.parse(data['end_date'])),
      engagement_users: data['engagement_users'],
      engagement_lead_email: data['engagement_lead_email'],
      engagement_lead_name: data['engagement_lead_name'],
      location: data['location'],
      ocp_cloud_provider_name: data['ocp_cloud_provider_name'],
      ocp_cloud_provider_region: data['ocp_cloud_provider_region'],
      ocp_cluster_size: data['ocp_cluster_size'],
      ocp_persistent_storage_size: data['ocp_persistent_storage_size'],
      ocp_sub_domain: data['ocp_sub_domain'],
      ocp_version: data['ocp_version'],
      project_id: data['project_id'],
      project_name: data['project_name'],
      start_date: new Date(Date.parse(data['start_date'])),
      technical_lead_email: data['technical_lead_email'],
      technical_lead_name: data['technical_lead_name'],
      launch: data['launch'],
    };
  }
}
