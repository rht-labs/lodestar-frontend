import { VersionService } from '../version_service';
import { Version } from '../../../schemas/version_schema';

export class FakedVersionService extends VersionService {
  async fetchVersion(): Promise<Version> {
    return {
      versions: {
        application: 'omp-frontend',
        git_commit: 'asdfas;flajsfja',
        git_tag: 'asfdahwhas',
        version: '1.0.0',
      },
    };
  }
}
