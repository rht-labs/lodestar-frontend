import { HostingEnvironment } from '../schemas/hosting_environment';
import { EngagementService } from '../services/engagement_service/engagement_service';

const requiredHostingEnvironmentFields: Array<keyof HostingEnvironment> = [
  'ocp_cloud_provider_name',
  'ocp_cloud_provider_region',
  'ocp_cluster_size',
  'ocp_persistent_storage_size',
  'ocp_sub_domain',
  'ocp_version',
];

const notNullOrUndefined = x => x !== null && x !== undefined && x !== '';
export async function validateHostingEnvironment(
  hostingEnvironment: HostingEnvironment,
  engagementService: EngagementService
): Promise<boolean> {
  const isSubdomainValid = await engagementService.checkSubdomainUniqueness(
    hostingEnvironment?.ocp_sub_domain
  );
  const hasRequiredFields = requiredHostingEnvironmentFields.every(k =>
    notNullOrUndefined(hostingEnvironment[k])
  );
  return hasRequiredFields && isSubdomainValid;
}
