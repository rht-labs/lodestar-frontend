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

export function hasRequiredFields(
  hostingEnvironment: Partial<HostingEnvironment>
) {
  return requiredHostingEnvironmentFields.every(k =>
    notNullOrUndefined(hostingEnvironment[k])
  );
}

const notNullOrUndefined = x => x !== null && x !== undefined && x !== '';
export async function validateHostingEnvironment(
  hostingEnvironment: Partial<HostingEnvironment>,
  engagementService: EngagementService,
  deconflictedSubdomain?: string
): Promise<boolean> {
  let isSubdomainValid = false;
  if (hostingEnvironment.ocp_sub_domain === deconflictedSubdomain) {
    isSubdomainValid = true;
  } else {
    isSubdomainValid = await engagementService.checkSubdomainUniqueness(
      hostingEnvironment?.ocp_sub_domain
    );
  }
  return hasRequiredFields(hostingEnvironment) && isSubdomainValid;
}
