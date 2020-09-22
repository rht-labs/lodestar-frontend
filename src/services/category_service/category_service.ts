import { EngagementCategory } from "../../schemas/engagement_category";

export abstract class CategoryService {
  abstract async fetchCategories(): Promise<EngagementCategory[]>;
}
