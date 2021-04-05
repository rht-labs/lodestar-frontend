import { VersionService } from '../../services/version_service/version_service';
import { AppVersion } from '../../schemas/version';
import { handleAxiosResponseErrors } from './http_error_handlers';
import { VersionJsonSerializer } from '../../serializers/version/version_json_serializer';
import { getApiV1HttpClient } from './client';

export class Apiv1VersionService extends VersionService {
  constructor(baseURL: string) {
    super();
    this.baseUrl = baseURL;
  }
  baseUrl: string;
  private static versionSerializer = new VersionJsonSerializer();
  private get axios() {
    return getApiV1HttpClient(this.baseUrl);
  }

  async fetchVersion(): Promise<AppVersion> {
    try {
      const { data } = await this.axios.get(
        `${this.baseUrl}/api/version/manifest`
      );

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
