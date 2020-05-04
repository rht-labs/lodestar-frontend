import React, { useContext } from 'react';
import { SessionContext } from '../session_context/session_context';
import { useFeatures } from './feature_hook';

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
  features: roles,
}: {
  children: React.ReactNode;
  features?: string[];
}) => {
  const sessionContext = useContext(SessionContext);
  const providedFeatures = roles ?? sessionContext.sessionData?.roles ?? [];

  const { features, hasFeature } = useFeatures(providedFeatures);
  return (
    <FeatureToggleContext.Provider value={{ features, hasFeature }}>
      {children}
    </FeatureToggleContext.Provider>
  );
};
