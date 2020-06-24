import { Serializer } from '../serializer';
import { Engagement } from '../../schemas/engagement_schema';
import { parse, format, parseISO, isValid } from 'date-fns';
import { LaunchData } from '../../schemas/launch_data';

export class EngagementJsonSerializer
  implements Serializer<Engagement, object> {
  private static formatDate(date: Date) {
    return format(date, 'yyyy-MM-dd');
  }
  private static parseDate(dateInput: any): Date {
    if (typeof dateInput === 'string') {
      try {
        const parsedDate = parse(dateInput, 'yyyy-MM-dd', new Date());
        if (isValid(parsedDate)) {
          return parsedDate;
        }
        return undefined;
      } catch (e) {
        return undefined;
      }
    }
  }
  serialize(engagement: Engagement): object {
    const e = {
      ...engagement,
      archive_date: engagement.archive_date
        ? EngagementJsonSerializer.formatDate(engagement.archive_date)
        : null,
      end_date: engagement.end_date
        ? EngagementJsonSerializer.formatDate(engagement.end_date)
        : null,
      start_date: engagement.start_date
        ? EngagementJsonSerializer.formatDate(engagement.start_date)
        : null,
      launch: this.serializeLaunchData(engagement.launch),
    };
    return e;
  }
  deserialize(data: object): Engagement {
    return {
      archive_date: data['archive_date'],
      customer_contact_email: data['customer_contact_email'],
      customer_contact_name: data['customer_contact_name'],
      customer_name: data['customer_name'],
      description: data['description'],
      end_date: data['end_date']
        ? EngagementJsonSerializer.parseDate(data['end_date'])
        : undefined,
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
      start_date: EngagementJsonSerializer.parseDate(data['start_date']),
      technical_lead_email: data['technical_lead_email'],
      technical_lead_name: data['technical_lead_name'],
      launch: this.parseLaunchData(data['launch']),
    };
  }

  private serializeLaunchData(launchData?: LaunchData) {
    return {
      launched_date_time: launchData?.launched_date_time
        ?.toISOString()
        ?.split('Z')?.[0], // backend doesn't support the 'Z' UTC notation
      launched_by: launchData?.launched_by,
    };
  }

  private parseLaunchData(launchData): LaunchData {
    if (!launchData) {
      return undefined;
    }
    return {
      launched_date_time: parseISO(launchData['launched_date_time']),
      launched_by: launchData['launched_by'],
    };
  }
}
