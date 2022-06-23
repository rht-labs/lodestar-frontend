import { VersionService } from '../../services/version_service/version_service';
import { AppVersion } from '../../schemas/version';
import { handleAxiosResponseErrors } from './http_error_handlers';
import { VersionJsonSerializer } from '../../serializers/version/version_json_serializer';
import { getApiV1HttpClient } from './client';

export class Apiv1VersionService implements VersionService {
  private static versionSerializer = new VersionJsonSerializer();
  private get axios() {
    return getApiV1HttpClient(false);
  }

  async fetchVersion(): Promise<AppVersion> {
    try {
      const { data } = await this.axios.get(`/api/version/manifest`);

      const serializedVersion = Apiv1VersionService.versionSerializer.deserialize(
        data
      );
      return serializedVersion;
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
}
