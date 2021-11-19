// All roles defined by the backend to be used in the frontend should be enumerated in this object.

export const APP_FEATURES = {
  admin: 'admin',
  writer: 'writer',
  reader: 'reader',
  notifications: 'notifications',
  engagementCardIcons: 'engagementCardIcons',
  resetUser: 'resetUser',
  dashboardDateSelector: 'dashboard-date-selector',
  newDashboard: 'newDashboard',
  engagementWriter: 'engagementWriter',
  copyFrom: 'copyFrom'
};

export type AppFeature = keyof typeof APP_FEATURES;
