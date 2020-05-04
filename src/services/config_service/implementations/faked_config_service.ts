import { ConfigService } from '../config_service';
import { Config } from '../../../schemas/config';

export class FakedConfigService extends ConfigService {
  async fetchConfig(): Promise<Config> {
    return Config.fromMap({
      baseUrl: 'http://localhost:3000',
      clientId: 'open-management-portal',
      authBaseUrl:
        'https://sso-omp-jasee.apps.s11.core.rht-labs.com/auth/realms/omp/protocol/openid-connect',
      backendUrl: 'https://omp-backend-omp.apps.test.omp.rht-labs.com',
      disableLaunch: false,
    });
  }
}
