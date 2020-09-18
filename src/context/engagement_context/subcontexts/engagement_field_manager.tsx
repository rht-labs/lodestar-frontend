import React, { useState } from 'react';
export interface EngagementFieldManagerContext {
  setFieldGroups: (fieldGroups: { [key: string]: string[] }) => void;
  fieldGroups: { [key: string]: string[] };
}

export const EngagementFieldManagerContext = React.createContext<
  EngagementFieldManagerContext
>(null);

interface EngagementFieldManagerContextProviderProps {
  children: any;
}

export const EngagementFieldManagerContextProvider = ({
  children,
}: EngagementFieldManagerContextProviderProps) => {
  const [fieldGroups, setFieldGroups] = useState<{ [key: string]: string[] }>(
    {}
  );
  return (
    <EngagementFieldManagerContext.Provider
      value={{ setFieldGroups, fieldGroups }}
    >
      {children}
    </EngagementFieldManagerContext.Provider>
  );
};
