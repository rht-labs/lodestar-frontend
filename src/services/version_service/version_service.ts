import { Version } from '../../schemas/version';

export abstract class VersionService {
  abstract async fetchVersion(): Promise<Version>;
}
