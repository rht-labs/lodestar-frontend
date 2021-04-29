// All roles defined by the backend to be used in the frontend should be enumerated in this object.

export const APP_FEATURES = {
  admin: 'admin',
  writer: 'writer',
  reader: 'reader',
  notifications: 'notifications',
  engagementCardIcons: 'engagementCardIcons',
  resetUser: 'resetUser',
  newDashboard: 'newDashboard',
};

export type AppFeature = keyof typeof APP_FEATURES;
