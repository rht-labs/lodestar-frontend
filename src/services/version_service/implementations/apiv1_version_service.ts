import { VersionService } from '../version_service';
import { Version } from '../../../schemas/version_schema';
import { AxiosInstance } from 'axios';

export class Apiv1VersionService extends VersionService {
  constructor({ axios, baseUrl }: { axios?: AxiosInstance; baseUrl?: string }) {
    super();
    if (!axios) {
      throw new Error('axios is required');
    }
    this.axios = axios;
    this.baseUrl = baseUrl;
  }
  baseUrl?: string;
  axios?: AxiosInstance;
  
  private async fetchManifest(): Promise<object> {
    const { data } = await this.axios.get(
      `${process.env.PUBLIC_URL}/manifest.json`
    );
    const rObject = [{'application': 'omp-frontend', 'git_commit': data.git_commit, 'git_tag': data.git_tag, 'version': data.git_tag}];
    return rObject;
  }

  async fetchVersion(): Promise<Version> {
    const { data } = await this.axios.get(
      `${this.baseUrl}/api/v1/version`
    );
    const fe = await this.fetchManifest();
    return Version.fromMap({...data, fe});
  }
}
