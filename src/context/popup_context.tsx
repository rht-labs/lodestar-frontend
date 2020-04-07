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

  const [
    hasShownFeatureRequestPopup,
    setHasShownFeatureRequestPopup,
  ] = useState<boolean>(true);

  useEffect(() => {
    const hasBeenShownStoredState =
      localStorage.getItem(featureRequestPopupKey) === 'true';
    if (hasShownFeatureRequestPopup !== hasBeenShownStoredState) {
      setHasShownFeatureRequestPopup(hasBeenShownStoredState);
    }
    if (!hasBeenShownStoredState) {
      setTimeout(() => {
        setHasShownFeatureRequestPopup(true);
      }, 5000);
    }
  }, [hasShownFeatureRequestPopup]);
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
