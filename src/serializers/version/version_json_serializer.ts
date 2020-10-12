import { Serializer } from '../serializer';
import { Version } from '../../schemas/version';

export class VersionJsonSerializer implements Serializer<Version, object> {
  serialize(version: Version): object {
    return version;
  }
  deserialize(data: object): Version {
    return {
      ...(data as Version),
      versions: {
        componentVersions: [
          {
            link_address: data['link_address'],
            name: data['name'],
            value: data['value'],
          }
        ],
          mainVersion: {
            link_address: data['link_address'],
            name: data['name'],
            value: data['value'],
          }
        }
    };
  }
}
