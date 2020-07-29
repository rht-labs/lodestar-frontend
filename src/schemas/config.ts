import { LogVerbosity } from '../utilities/logger/logger';
import { getLogVerbosityFromString } from '../utilities/logger';

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
