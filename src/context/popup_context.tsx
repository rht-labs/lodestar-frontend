import React, { useEffect } from 'react';
import { createContext, useState } from 'react';

export interface PopupContext {
  hasBeenShown: boolean;
  onDismissed: () => void;
}

export const PopupContext = createContext<PopupContext>({
  hasBeenShown: true,
  onDismissed: () => null,
});

const { Provider } = PopupContext;

export function PopupProvider({ children }: { children: React.ReactChild }) {
  const featureRequestPopupKey = 'hasShownFeatureRequestPopup';
  const hasBeenShownStoredState =
    localStorage.getItem(featureRequestPopupKey) === 'true';

  console.log('hasbeenshown', hasBeenShownStoredState);
  const [
    hasShownFeatureRequestPopup,
    setHasShownFeatureRequestPopup,
  ] = useState<boolean>(hasBeenShownStoredState);

  useEffect(() => {
    if (!hasBeenShownStoredState) {
      setTimeout(() => {
        setHasShownFeatureRequestPopup(true);
      }, 5000);
    }
  }, [hasBeenShownStoredState]);
  const onDismissed = () => {
    setHasShownFeatureRequestPopup(true);
    localStorage.setItem(featureRequestPopupKey, 'true');
  };
  return (
    <Provider
      value={{
        hasBeenShown: hasShownFeatureRequestPopup,
        onDismissed,
      }}
    >
      {children}
    </Provider>
  );
}
