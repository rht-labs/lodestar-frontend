import React, { useCallback } from 'react';
import { useSession } from '../auth_context/auth_context';

interface IFeatureToggleContext {
  features: string[];
  hasFeature: (name: string) => boolean;
}

export const FeatureToggleContext = React.createContext<IFeatureToggleContext>({
  features: [],
  hasFeature: () => false,
});

export const FeatureToggles = ({
  children,
  features,
}: {
  children: React.ReactNode;
  features?: string[];
}) => {
  const authContext = useSession();
  const providedFeatures = (authContext.sessionData?.roles ?? []).concat(
    features ?? []
  );
  const hasFeature = useCallback(
    (name: string) => {
      return name && providedFeatures.includes(name);
    },
    [providedFeatures]
  );

  return (
    <FeatureToggleContext.Provider
      value={{ features: providedFeatures, hasFeature }}
    >
      {children}
    </FeatureToggleContext.Provider>
  );
};
