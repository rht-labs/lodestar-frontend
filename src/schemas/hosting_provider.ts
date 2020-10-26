import faker from 'faker';
import { uuid } from 'uuidv4';
export interface HostingProvider {
  id: string;
  additional_details?: string;
  ocp_cloud_provider_name: string;
  suggested_subdomain?: string;
  ocp_cloud_provider_region: string;
  ocp_cluster_size: string;
  ocp_persistent_storage_size: string;
  ocp_sub_domain: string;
  ocp_version: string;
}

export abstract class HostingProvider {
  static fromFake(staticData = false) {
    return {
      id: uuid(),
      additional_details: staticData ? 'details' : faker.lorem.paragraph(),
      ocp_cloud_provider_name: staticData ? 'AWS' : 'AWS',
      ocp_cloud_provider_region: staticData
        ? 'N. Virginia'
        : faker.lorem.word(),
      ocp_cluster_size: staticData ? 'Large' : 'Large',
      ocp_persistent_storage_size: staticData
        ? '100G'
        : `${faker.random.number()}G`,
      ocp_sub_domain: staticData ? 'ordoabchao' : faker.lorem.word(),
      ocp_version: staticData ? '4.4' : faker.random.number().toString(),
    };
  }
}
