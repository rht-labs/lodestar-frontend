// All roles defined by the backend to be used in the frontend should be enumerated in this object.

export type AppFeature =
  | 'writer'
  | 'reader'
  | 'admin'
  | 'notifications'
  | 'engagementCardIcons';

export const APP_FEATURES: { [key: string]: AppFeature } = {
  writer: 'writer',
  reader: 'reader',
  admin: 'admin',
  notifications: 'notifications',
  engagementCardIcons: 'engagementCardIcons',
};
