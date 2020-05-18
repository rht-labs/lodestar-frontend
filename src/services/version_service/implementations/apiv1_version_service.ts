import { VersionService } from '../version_service';
import { Version } from '../../../schemas/version_schema';
import Axios, { AxiosInstance } from 'axios';

export class Apiv1VersionService extends VersionService {
  constructor(baseURL: string, onBeforeRequest, onAfterRequest, onFailure) {
    super();
    this.axios = Axios.create();
    this.baseUrl = baseURL;
    this.axios.interceptors.request.use(onBeforeRequest);
    this.axios.interceptors.response.use(onAfterRequest, onFailure);
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
    const { data } = await this.axios.get(`${this.baseUrl}/api/v1/version`);
    const fe = await this.fetchManifest();
    return Version.fromMap({ ...data, fe });
  }
}
