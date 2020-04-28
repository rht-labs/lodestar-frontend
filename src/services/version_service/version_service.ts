import { Version } from '../../schemas/version_schema';

export abstract class VersionService {
  abstract async fetchVersion(): Promise<Version>;
}
