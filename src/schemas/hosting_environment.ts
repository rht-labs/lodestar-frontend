import faker from 'faker';
import { uuid } from 'uuidv4';
export interface HostingEnvironment {
  uuid: string;
  additional_details?: string;
  ocp_cloud_provider_name: string;
  suggested_subdomain?: string;
  ocp_cloud_provider_region: string;
  ocp_cloud_provider_availability_zone: string;
  ocp_cluster_size: string;
  ocp_persistent_storage_size: string;
  ocp_sub_domain: string;
  ocp_version: string;
  environment_name: string;
}

export abstract class HostingEnvironment {
  static fromFake(staticData = false) {
    return {
      uuid: staticData ? 'uuid' : uuid(),
      environment_name: staticData ? 'name' : faker.lorem.words(3),
      additional_details: staticData ? 'details' : faker.lorem.paragraph(),
      ocp_cloud_provider_name: staticData ? 'AWS' : 'AWS',
      ocp_cloud_provider_region: staticData
        ? 'N. Virginia'
        : faker.lorem.word(),
      ocp_cloud_provider_availability_zone: staticData ? 'One' : 'One',
      ocp_cluster_size: staticData ? 'Large' : 'Large',
      ocp_persistent_storage_size: staticData
        ? '100G'
        : `${faker.random.number()}G`,
      ocp_sub_domain: staticData ? 'ordoabchao' : faker.lorem.word(),
      ocp_version: staticData ? '4.4' : faker.random.number().toString(),
    };
  }
}
