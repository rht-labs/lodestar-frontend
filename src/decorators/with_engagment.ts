import { Engagement } from '../schemas/engagement';

export interface HasEngagementUUID {
  engagement_uuid?: string;
}
export function withEngagement<T extends HasEngagementUUID>(
  engagementIdItemGetter: (...params) => Promise<T[]>,
  engagementGetter: (id: string) => Promise<Partial<Engagement>>
): (params: any) => Promise<(Partial<Engagement> & T)[]> {
  return async (...params) => {
    const items = await engagementIdItemGetter(...params);
    const expandedItems = await Promise.all(
      items
        .filter(i => !!i.engagement_uuid)
        .map(async i => {
          const engagement = await engagementGetter(i.engagement_uuid);
          return { ...i, ...engagement };
        })
    );
    console.log(expandedItems);
    return expandedItems as (T & Partial<Engagement>)[];
  };
}
