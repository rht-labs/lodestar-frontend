import { AppVersion } from '../../schemas/version';

export abstract class VersionService {
  abstract fetchVersion(): Promise<AppVersion>;
}
