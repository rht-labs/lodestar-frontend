import React, { useContext, useCallback } from 'react';
import { SessionContext } from '../session_context/session_context';

interface FeatureToggleContext {
  features: string[];
  hasFeature: (name: string) => boolean;
}

export const FeatureToggleContext = React.createContext<FeatureToggleContext>({
  features: [],
  hasFeature: () => false,
});

export const FeatureToggles = ({ children }: { children: React.ReactNode }) => {
  const sessionContext = useContext(SessionContext);
  const features = sessionContext.sessionData?.roles ?? [];
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
