import { EnabledUsers } from '../../schemas/engagement';

export interface EnabledUsersFilter {
  page?: number;
  perPage?: number;
  startDate?: Date;
  endDate?: Date;
  regions?: string[];
}
export interface EnabledUsersService {
  getEnabledUsers(filter?: EnabledUsersFilter): Promise<EnabledUsers[]>;
}
