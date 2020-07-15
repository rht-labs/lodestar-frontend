import { LogVerbosity } from '../utilities/logger/logger';
import { getLogVerbosityFromString } from '../utilities/logger';

export interface Config {
  baseUrl: string;
  clientId: string;
  authBaseUrl: string;
  backendUrl: string;
  disableLaunch: boolean;
  loggerType: string;
  logLevel: LogVerbosity;
}
export class Config {
  constructor({
    baseUrl,
    clientId,
    authBaseUrl,
    backendUrl,
    disableLaunch,
    logLevel,
    loggerType,
    supportEmailAddress,
  }: Config) {
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.authBaseUrl = authBaseUrl;
    this.backendUrl = backendUrl;
    this.disableLaunch = disableLaunch;
    this.logLevel = logLevel;
    this.loggerType = loggerType;
    this.supportEmailAddress = supportEmailAddress;
  }

  baseUrl: string;
  clientId: string;
  authBaseUrl: string;
  backendUrl: string;
  disableLaunch: boolean;
  logLevel: LogVerbosity;
  loggerType: string;
  supportEmailAddress: string;

  static fromMap(map: { [key: string]: unknown }) {
    return new Config({
      baseUrl: map['baseUrl'] as string,
      clientId: map['clientId'] as string,
      authBaseUrl: map['authBaseUrl'] as string,
      backendUrl: map['backendUrl'] as string,
      disableLaunch: map['disableLaunch'] as boolean,
      logLevel: getLogVerbosityFromString(map['logLevel'] as string),
      loggerType: map['loggerType'] as string,
      supportEmailAddress: map['supportEmailAddress'] as string,
    });
  }
}
