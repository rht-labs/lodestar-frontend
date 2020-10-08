import { VersionService } from '../version_service';
import { Version } from '../../../schemas/version';
import Axios, { AxiosInstance } from 'axios';
import { UserToken } from '../../../schemas/user_token';
import { handleAxiosResponseErrors } from '../../common/axios/http_error_handlers';
import {VersionJsonSerializer} from "../../../serializers/version/version_json_serializer";

export class Apiv1VersionService extends VersionService {
  constructor(baseURL: string) {
    super();
    this.axios = Axios.create();
    this.baseUrl = baseURL;
    this.axios.interceptors.request.use(request => {
      request.headers.Authorization = `Bearer ${UserToken.token?.accessToken}`;
      return request;
    });
  }
  baseUrl: string;
  private static versionSerializer = new VersionJsonSerializer();
  axios?: AxiosInstance;

  private async fetchManifest(): Promise<object> {
    const { data } = await this.axios.get(
      `${process.env.PUBLIC_URL}/manifest.json`
    );
    const rObject = [
      {
        application: 'lodestar-frontend',
        git_commit: data.git_commit,
        git_tag: data.git_tag,
        version: data.git_tag,
      },
    ];
    return rObject;
  }

  async fetchVersion(): Promise<Version> {
    try {
      const { data } = await this.axios.get(`${this.baseUrl}/api/version/manifest`);

      const serializedVersion = Apiv1VersionService.versionSerializer.deserialize(data);
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
