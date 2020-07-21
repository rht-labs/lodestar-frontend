import React, { useCallback } from 'react';
import { useSession } from '../auth_context/auth_context';

interface FeatureToggleContext {
  features: string[];
  hasFeature: (name: string) => boolean;
}

export const FeatureToggleContext = React.createContext<FeatureToggleContext>({
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
  const providedFeatures = features ?? authContext.sessionData?.roles ?? [];
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
