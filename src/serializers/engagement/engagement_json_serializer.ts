import { Serializer } from '../serializer';
import { Engagement, Artifact, EngagementUser } from '../../schemas/engagement';
import { parse, parseISO, isValid } from 'date-fns';
import { LaunchData } from '../../schemas/launch_data';
import { GitCommitJsonSerializer } from '../git_commit/git_commit_json_serializer';
import { ClusterStatusJsonSerializer } from '../cluster_status/cluster_status_json_serializer';
import { Logger } from '../../utilities/logger';
import { uuid } from 'uuidv4';
import { HostingEnvironment } from '../../schemas/hosting_environment';

export class EngagementJsonSerializer
  implements Serializer<Engagement, object> {
  private static formatDate(date: Date): string | undefined {
    return date?.toISOString?.();
  }
  private static gitCommitSerializer = new GitCommitJsonSerializer();
  private static clusterStatusSerializer = new ClusterStatusJsonSerializer();
  private static parseDate(dateInput: any): Date | undefined {
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
      archive_date: engagement.archive_date
        ? EngagementJsonSerializer.formatDate(engagement.archive_date)
        : null,
      end_date: engagement.end_date
        ? EngagementJsonSerializer.formatDate(engagement.end_date)
        : null,
      start_date: engagement.start_date
        ? EngagementJsonSerializer.formatDate(engagement.start_date)
        : null,
      artifacts: engagement?.artifacts?.map?.(a => ({
        ...a,
        link_address: a.linkAddress,
      })),
    };
    const trimmedValues = Object.keys(e).reduce((acc, currKey) => {
      acc[currKey] = e[currKey];
      if (
        typeof acc[currKey] === 'string' &&
        typeof acc[currKey]?.trim === 'function'
      ) {
        acc[currKey] = acc[currKey].trim();
      }
      return acc;
    }, {});
    return trimmedValues;
  }
  private static deserializeHostingEnvironment(
    data: object
  ): HostingEnvironment {
    return {
      id: data['id'] || uuid(),
      environment_name: data['environment_name'],
      ocp_cloud_provider_name: data['ocp_cloud_provider_name'],
      ocp_cloud_provider_region: data['ocp_cloud_provider_region'],
      ocp_cluster_size: data['ocp_cluster_size'],
      ocp_persistent_storage_size: data['ocp_persistent_storage_size'],
      ocp_sub_domain: data['ocp_sub_domain'],
      ocp_version: data['ocp_version'],
      additional_details: data['additional_details'],
    };
  }

  private static deserializeArtifact(data: object): Artifact {
    return {
      id: data['id'] ?? uuid(),
      type: data['type'],
      title: data['title'],
      linkAddress: data['link_address'],
      description: data['description'],
    };
  }
  deserialize(data: object): Engagement {
    return {
      ...data,
      use_cases: data['use_cases'],
      mongo_id: data['mongo_id'],
      public_reference: data['public_reference'],
      additional_details: data['additional_details'],
      archive_date: data['archive_date']
        ? EngagementJsonSerializer.parseDate(data['archive_date'])
        : undefined,
      artifacts: (data['artifacts'] ?? []).map(
        EngagementJsonSerializer.deserializeArtifact
      ),
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
      engagement_region: data['engagement_region'],
      engagement_users:
        data['engagement_users']?.map?.(
          EngagementJsonSerializer.deserializeEngagementUser
        ) ?? [],
      engagement_lead_email: data['engagement_lead_email'],
      engagement_lead_name: data['engagement_lead_name'],
      engagement_type: data['engagement_type'],
      hosting_environments:
        data['hosting_environments']?.map?.(
          EngagementJsonSerializer.deserializeHostingEnvironment
        ) ?? [],
      last_update: data['last_update'],
      location: data['location'],
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
      engagement_categories: data['engagement_categories'],
      timezone: data['timezone'],
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

  private static deserializeEngagementUser(data: object): EngagementUser {
    return {
      ...(data as EngagementUser),
      uuid: data['uuid'] ?? uuid(),
    };
  }
}
