import { VersionService } from '../version_service';
import { Version } from '../../../schemas/version';
import Axios, { AxiosInstance } from 'axios';
import { UserToken } from '../../../schemas/user_token';
import { handleAxiosResponseErrors } from '../../common/axios/http_error_handlers';

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
  axios?: AxiosInstance;

  private async fetchManifest(): Promise<object> {
    const { data } = await this.axios.get(
      `${process.env.PUBLIC_URL}/manifest.json`
    );
    const rObject = [
      {
        application: 'omp-frontend',
        git_commit: data.git_commit,
        git_tag: data.git_tag,
        version: data.git_tag,
      },
    ];
    return rObject;
  }

  async fetchVersion(): Promise<Version> {
    try {
      const { data } = await this.axios.get(`${this.baseUrl}/api/v1/version`);
      const fe = await this.fetchManifest();
      return { versions: { ...data, fe } };
    } catch (e) {
      handleAxiosResponseErrors(e);
      throw e;
    }
  }
}
