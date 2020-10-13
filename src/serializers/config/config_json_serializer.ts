import { Serializer } from '../serializer';
import { Config } from '../../schemas/config';
import { getLogVerbosityFromString } from '../../utilities/logger';

export class ConfigJsonSerializer implements Serializer<Config, object> {
  serialize(config: Config) {
    return {};
  }
  deserialize(data: object) {
    return {
      baseUrl: data['baseUrl'],
      clientId: data['clientId'],
      authBaseUrl: data['authBaseUrl'],
      backendUrl: data['backendUrl'],
      disableLaunch: data['disableLaunch'],
      loggerType: data['loggerType'],
      logLevel: getLogVerbosityFromString(data['logLevel'] as string),
      supportEmailAddress: data['supportEmailAddress'],
      bannerMessages: data['bannerMessages'],
      analyticsTrackingCode: data['analyticsTrackingCode'],
    };
  }
}
