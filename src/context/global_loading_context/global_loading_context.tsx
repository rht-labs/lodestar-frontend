import { useContext, createContext } from 'react';

const GlobalLoadingContext = createContext<undefined>(undefined);

const GlobalLoadingProvider = (props: { children: any }) => {
  return (
    <GlobalLoadingContext.Provider value={undefined}>
      {props.children}
    </GlobalLoadingContext.Provider>
  );
};
