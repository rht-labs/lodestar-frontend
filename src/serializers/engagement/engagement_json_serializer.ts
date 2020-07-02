import { Serializer } from '../serializer';
import { Engagement } from '../../schemas/engagement_schema';
import { parse, format, parseISO, isValid } from 'date-fns';
import { LaunchData } from '../../schemas/launch_data';
import { GitCommitJsonSerializer } from '../git_commit/git_commit_json_serializer';
import { ClusterStatusJsonSerializer } from '../cluster_status/cluster_status_json_serializer';
import { Logger } from '../../utilities/logger';

export class EngagementJsonSerializer
  implements Serializer<Engagement, object> {
  private static formatDate(date: Date) {
    return format(date, 'yyyy-MM-dd');
  }
  private static gitCommitSerializer = new GitCommitJsonSerializer();
  private static clusterStatusSerializer = new ClusterStatusJsonSerializer();
  private static parseDate(dateInput: any): Date {
    if (typeof dateInput === 'string') {
      try {
        let parsedDate;
        parsedDate = parseISO(dateInput);
        if (isValid(parsedDate)) {
          return parsedDate;
        }
        parsedDate = parse(dateInput, 'yyyy-MM-dd', new Date());
        if (isValid(parsedDate)) {
          return parsedDate;
        }
        return undefined;
      } catch (e) {
        Logger.instance.error(e);
        return undefined;
      }
    }
  }
  serialize(engagement: Engagement): object {
    const e = {
      ...engagement,
      additional_details: (engagement.additional_details ?? '').trim(),
      archive_date: engagement.archive_date
        ? EngagementJsonSerializer.formatDate(engagement.archive_date)
        : null,
      end_date: engagement.end_date
        ? EngagementJsonSerializer.formatDate(engagement.end_date)
        : null,
      start_date: engagement.start_date
        ? EngagementJsonSerializer.formatDate(engagement.start_date)
        : null,
    };
    return e;
  }
  deserialize(data: object): Engagement {
    return {
      ...data,
      additional_details: data['additional_details'],
      archive_date: data['archive_date']
        ? EngagementJsonSerializer.parseDate(data['archive_date'])
        : undefined,
      commits: (data['commits'] as any[])
        ?.filter(d => !(d['author_email'] === 'bot@bot.com'))
        ?.map(d => EngagementJsonSerializer.gitCommitSerializer.deserialize(d)),
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
      status: EngagementJsonSerializer.clusterStatusSerializer.deserialize(
        data['status']
      ),
      creation_details: data['creation_details'],
      last_update_by_name: data['last_update_by_name'],
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
