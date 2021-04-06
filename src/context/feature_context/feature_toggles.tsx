import React, { useCallback } from 'react';

export interface IFeatureToggleContext {
  features: string[];
  hasFeature: (name: string) => boolean;
}

export const FeatureToggleContext = React.createContext<IFeatureToggleContext>({
  features: [],
  hasFeature: () => false,
});

export interface IFeatureToggleProvider {
  features?: string[];
  children: any;
}

export const FeatureToggles = ({
  children,
  features = [],
}: IFeatureToggleProvider) => {
  const hasFeature = useCallback(
    (name: string) => {
      return name && features.includes(name);
    },
    [features]
  );

  return (
    <FeatureToggleContext.Provider value={{ features, hasFeature }}>
      {children}
    </FeatureToggleContext.Provider>
  );
};
