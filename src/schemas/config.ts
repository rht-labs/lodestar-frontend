import { LogVerbosity } from '../utilities/logger/logger';

export interface BannerMessage {
  message: string;
  backgroundcolor: string;
}
export interface Config {
  analyticsTrackingCode: string;
  baseUrl: string;
  clientId: string;
  authBaseUrl: string;
  backendUrl: string;
  disableLaunch: boolean;
  loggerType?: string;
  logLevel?: LogVerbosity;
  supportEmailAddress: string;
  bannerMessages?: BannerMessage[];
}

export abstract class Config {
  public static fromFake(): Config {
    return {
      analyticsTrackingCode: 'UA-FAKED',
      baseUrl: 'http://localhost:3000',
      clientId: 'lodestar',
      authBaseUrl:
        'https://sso.example.com/auth/realms/lodestar/protocol/openid-connect',
      backendUrl: 'https://lodestar-backend.example.com',
      disableLaunch: false,
      supportEmailAddress: 'redhatsupport@redhat.com',
      bannerMessages: [
        {
          message: 'Hello message 1',
          backgroundcolor: '#FF0000',
        },
      ],
    };
  }
}
