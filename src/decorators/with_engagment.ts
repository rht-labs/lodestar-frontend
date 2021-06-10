import { Engagement } from '../schemas/engagement';

export interface HasEngagementUUID {
  engagement_uuid?: string;
}

export interface CombinedResult<T> {
  items: T[];
  engagements: Partial<Engagement>[];
}
export async function withEngagement<T extends HasEngagementUUID>(
  engagementIdItemGetter: (...params) => Promise<T[]>,
  engagementGetter: (id: string) => Promise<Partial<Engagement>>
): Promise<CombinedResult<T>> {
  const items = await engagementIdItemGetter();
  const engagements = await Promise.all(
    items
      .filter(i => !!i.engagement_uuid)
      .map(i => {
        return engagementGetter(i.engagement_uuid);
      })
  );
  return {
    items,
    engagements,
  };
}
