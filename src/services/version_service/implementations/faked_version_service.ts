import { VersionService } from '../version_service';
import { AppVersion } from '../../../schemas/version';

export class FakedVersionService extends VersionService {
  async fetchVersion(): Promise<AppVersion> {
    return {
      componentVersions: [{ name: 'version 2', value: '2' }],
      mainVersion: { name: 'version 1', value: '1' },
    };
  }
}
