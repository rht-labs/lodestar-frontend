export interface ApiV1Config {
  authBaseUrl: string;
  baseUrl: string;
  clientId: string;
  backendUrl: string;
}
export abstract class ApiV1 {
  private static _config: ApiV1Config;
  public static initialize(config: ApiV1Config) {
    ApiV1._config = config;
  }
  public static get config(): ApiV1Config {
    return ApiV1._config;
  }
  public static validateConfig() {
    if (!ApiV1.config) {
      throw TypeError(
        'ApiV1.initialize must be called before using the auth service'
      );
    }
    if (!ApiV1.config.authBaseUrl) {
      throw TypeError('authBaseUrl must not be null');
    }
    if (!ApiV1.config.clientId) {
      throw TypeError('clientId must not be null');
    }
    if (!ApiV1.config.baseUrl) {
      throw TypeError('baseUrl must not be null');
    }
  }
}
