import { HostingEnvironment } from '../schemas/hosting_environment';
import { EngagementService } from '../services/engagement_service/engagement_service';
import { validateHostingEnvironment } from './validate_hosting_environment';

describe('hosting environment validator', () => {
  let engagementService;
  beforeEach(() => {
    const existingSubdomain = 'asdf';
    engagementService = {
      checkSubdomainUniqueness: async s => s !== existingSubdomain,
    } as EngagementService;
  });
  test('should return false when the subdomain is a duplicate', async () => {
    const isValid = await validateHostingEnvironment(
      { ocp_sub_domain: 'asdf' } as HostingEnvironment,
      engagementService
    );
    expect(isValid).toBe(false);
    return;
  });
  test('should return false when any required field is missing', async () => {
    const isValid = await validateHostingEnvironment(
      { ocp_cloud_provider_name: 'valid_name' } as HostingEnvironment,
      engagementService
    );
    expect(isValid).toBe(false);
  });
  test('should return true only when all fields are valid', async () => {
    const hostingEnvironment = {
      ocp_cloud_provider_name: 'aws',
      ocp_cloud_provider_region: 'na',
      ocp_cluster_size: 'big',
      ocp_persistent_storage_size: '50z',
      ocp_sub_domain: 'super_unique',
      ocp_version: '4',
    } as HostingEnvironment;
    const isValid = await validateHostingEnvironment(
      hostingEnvironment,
      engagementService
    );
    expect(isValid).toBe(true);
  });
});
