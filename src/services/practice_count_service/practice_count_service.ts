import { PracticeCount } from '../../schemas/engagement';

export interface PracticeCountFilter {
  page?: number;
  perPage?: number;
  startDate?: Date;
  endDate?: Date;
  regions?: string[];
}
export interface PracticeCountService {
  getPracticeCount(filter?: PracticeCountFilter): Promise<PracticeCount[]>;
}
