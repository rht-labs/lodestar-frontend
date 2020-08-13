import { LogVerbosity } from '../utilities/logger/logger';

export interface BannerMessage {
  message: string;
  backgroundcolor: string;
}
export interface Config {
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
      baseUrl: 'http://localhost:3000',
      clientId: 'lodestar',
      authBaseUrl:
        'https://sso.example.com/auth/realms/omp/protocol/openid-connect',
      backendUrl: 'https://omp-backend.example.com',
      disableLaunch: false,
      supportEmailAddress: 'redhatsupport@redhat.com',
      bannerMessages: [
        {
          message: 'Hello message 1',
          backgroundcolor: '#FF0000',
        },
        {
          message: 'Hello message 2',
          backgroundcolor: '#FFFF00',
        },
        {
          message: 'Hello message 3',
          backgroundcolor: 'darkpurple',
        },
        {
          message: 'Hello message 4',
          backgroundcolor: 'brown',
        },
        {
          message: 'Hello message 5',
          backgroundcolor: 'green',
        },
        {
          message: 'Hello message 6',
          backgroundcolor: 'blue',
        },
        {
          message: 'Hello message 7',
          backgroundcolor: 'grey',
        },
        {
          message: 'Hello message 8',
          backgroundcolor: 'white',
        },
        {
          message: 'Hello message 9',
          backgroundcolor: 'indigo',
        },
      ],
    };
  }
}
