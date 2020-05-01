import { VersionService } from '../version_service';
import { Version } from '../../../schemas/version_schema';

export class Apiv1VersionService extends VersionService {
  async fetchVersion(): Promise<Version> {
    return Version.fromMap({
      application: 'omp-frontend',
      git_commit: 'asdfas;flajsfja',
      git_tag: 'asfdahwhas',
      version: '1.0.0',
    });
  }
}
