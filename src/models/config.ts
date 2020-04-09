export interface Config {
  baseUrl: string;
  clientId: string;
  authBaseUrl: string;
  backendUrl: string;
}
export class Config {
  constructor({ baseUrl, clientId, authBaseUrl, backendUrl }: Config) {
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.authBaseUrl = authBaseUrl;
    this.backendUrl = backendUrl;
  }

  baseUrl: string;
  clientId: string;
  authBaseUrl: string;
  backendUrl: string;

  static fromMap(map: { [key: string]: unknown }) {
    return new Config({
      baseUrl: map['baseUrl'] as string,
      clientId: map['clientId'] as string,
      authBaseUrl: map['authBaseUrl'] as string,
      backendUrl: map['backendUrl'] as string,
    });
  }
}
