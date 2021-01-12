// All roles defined by the backend to be used in the frontend should be enumerated in this object.

export const APP_FEATURES: { [key: string]: string } = {
  admin: 'admin',
  writer: 'writer',
  reader: 'reader',
  notifications: 'notifications',
  engagementCardIcons: 'engagementCardIcons',
  resetUser: 'resetUser',
};

export type AppFeature = keyof typeof APP_FEATURES;
