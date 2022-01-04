import { SummaryCount } from '../../schemas/engagement';

export interface SummaryCountFilter {
  page?: number;
  perPage?: number;
  startDate?: Date;
  endDate?: Date;
  regions?: string[];
}
export interface SummaryCountService {
  getSummaryCount(filter?: SummaryCountFilter): Promise<SummaryCount>;
}
