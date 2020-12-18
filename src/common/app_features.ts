// All roles defined by the backend to be used in the frontend should be enumerated in this object.

export type AppFeature =
  | 'admin'
  | 'writer'
  | 'reader'
  | 'notifications'
  | 'engagementCardIcons';

export const APP_FEATURES: { [key: string]: AppFeature } = {
  admin: 'admin',
  writer: 'writer',
  reader: 'reader',
  notifications: 'notifications',
  engagementCardIcons: 'engagementCardIcons',
};
