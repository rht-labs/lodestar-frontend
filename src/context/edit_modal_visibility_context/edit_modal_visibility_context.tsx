import React, { useState, useCallback } from 'react';

export interface IModalVisibilityContext {
  activeModalKey: string;
  requestOpen: (requestingModalKey: string) => void;
  requestClose: () => void;
}

export const ModalVisibilityContext = React.createContext<
  IModalVisibilityContext
>({
  activeModalKey: null,
  requestOpen: () => null,
  requestClose: () => null,
});

const { Provider } = ModalVisibilityContext;

export const ModalVisibilityProvider = ({ children }) => {
  const [activeModalKey, setActiveModalKey] = useState<string>(null);
  const requestOpen = useCallback(
    (requestingModalKey: string) => {
      setActiveModalKey(requestingModalKey);
    },
    [setActiveModalKey]
  );

  const requestClose = useCallback(() => setActiveModalKey(null), [
    setActiveModalKey,
  ]);

  return (
    <Provider
      value={{
        requestClose,
        activeModalKey,
        requestOpen,
      }}
    >
      {children}
    </Provider>
  );
};
