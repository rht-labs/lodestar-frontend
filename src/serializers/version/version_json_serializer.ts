import { Serializer } from '../serializer';
import { AppVersion } from '../../schemas/version';

export class VersionJsonSerializer implements Serializer<AppVersion, object> {
  serialize(version: AppVersion): object {
    return version;
  }
  deserialize(data: object): AppVersion {
    return {
      ...(data as AppVersion),
      componentVersions: data['component_versions'],
      mainVersion: data['main_version'],
    };
  }
}
