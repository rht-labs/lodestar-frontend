import { ConfigService } from '../config_service';
import { Config } from '../../../schemas/config';

export class FakedConfigService extends ConfigService {
  async fetchConfig(): Promise<Config> {
    return Config.fromMap({
      baseUrl: 'http://localhost:3000',
      clientId: 'open-management-portal',
      authBaseUrl:
        'https://sso.example.com/auth/realms/omp/protocol/openid-connect',
      backendUrl: 'https://omp-backend.example.com',
      disableLaunch: false,
    });
  }
}
