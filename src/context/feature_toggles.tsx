import React, { useContext } from 'react';
import { SessionContext } from './session_context';

interface FeatureToggleContext {
  features: string[];
}

export const FeatureToggleContext = React.createContext<FeatureToggleContext>({
  features: [],
});

export const FeatureToggles = ({ children }: { children: React.ReactNode }) => {
  const sessionContext = useContext(SessionContext);
  const features = sessionContext.sessionData?.roles ?? [];
  return (
    <FeatureToggleContext.Provider value={{ features }}>
      {children}
    </FeatureToggleContext.Provider>
  );
};
