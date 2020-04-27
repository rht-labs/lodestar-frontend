// All roles defined by the backend to be used in the frontend should be enumerated in this object.

export type AppFeature = 'writer' | 'reader';

export const APP_FEATURES: { [key: string]: AppFeature } = {
  writer: 'writer',
  reader: 'reader',
};
