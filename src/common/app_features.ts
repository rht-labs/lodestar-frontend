// All roles defined by the backend to be used in the frontend should be enumerated in this object.

export const APP_FEATURES = {
  admin: 'admin',
  writer: 'writer',
  reader: 'reader',
  notifications: 'notifications',
  engagementCardIcons: 'engagementCardIcons',
  dashboardDateSelector: 'dashboard-date-selector',
  engagementWriter: 'engagementWriter',
  copyFrom: 'copyFrom'
};

export type AppFeature = keyof typeof APP_FEATURES;
