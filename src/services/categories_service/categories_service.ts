import { EngagementCategory } from "../../schemas/engagement_category";

export abstract class CategoriesService {
  abstract async fetchCategories(): Promise<EngagementCategory[]>;
}
