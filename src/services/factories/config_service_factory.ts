import { FakedConfigService } from '../config_service/implementations/faked_config_service';
import { PublicConfigService } from '../config_service/implementations/public_config_service';
export function createConfigService(useFaked = false) {
  if (useFaked) {
    return new FakedConfigService();
  }
  return new PublicConfigService();
}
