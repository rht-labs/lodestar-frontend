import { Serializer } from '../serializer';
import { Config } from '../../schemas/config';
import { getLogVerbosityFromString } from '../../utilities/logger';

export class ConfigJsonSerializer implements Serializer<Config, object> {
  serialize(config: Config) {
    return config;
  }
  deserialize(data: object): Config {
    return {
      baseUrl: data['baseUrl'],
      clientId: data['clientId'],
      authBaseUrl: data['authBaseUrl'],
      backendUrl: data['backendUrl'],
      disableLaunch: data['disableLaunch'] ?? false,
      loggerType: data['loggerType'],
      logLevel: getLogVerbosityFromString(data['logLevel'] as string),
      supportEmailAddress: data['supportEmailAddress'],
      bannerMessages: data['bannerMessages'],
      landingVideos: data['landingVideos'],
      analyticsTrackingCode: data['analyticsTrackingCode'] ?? '',
      allowVersionOverride: data['allowVersionOverride'] ?? false,
      roles: data['roles'],
    };
  }
}
