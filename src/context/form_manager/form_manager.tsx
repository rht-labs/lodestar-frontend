import React, { useContext, useState, useCallback } from 'react';

export interface FormManagerContext {
  registerField: (groupName: string, fieldName: string) => void;
  fieldGroups: { [key: string]: string[] };
}

const FormManagerContext = React.createContext<FormManagerContext>(null);

export interface FormManagerGroupContext {
  registerField: (fieldName: string) => void;
}
const FormManagerGroupContext = React.createContext<FormManagerGroupContext>({
  registerField: () => {},
});

const FormManagerProvider = ({ children }) => {
  const [fieldGroups, setFieldGroups] = useState({});
  const registerField = useCallback(
    (groupName: string, fieldName: string) => {
      if (!fieldGroups[groupName]) {
        setFieldGroups({ ...fieldGroups, [groupName]: [fieldName] });
      } else {
        if (!fieldGroups[groupName].includes(fieldName)) {
          setFieldGroups({
            ...fieldGroups,
            [groupName]: [...fieldGroups[groupName], fieldName],
          });
        }
      }
    },
    [fieldGroups]
  );
  return (
    <FormManagerContext.Provider value={{ registerField, fieldGroups }}>
      {children}
    </FormManagerContext.Provider>
  );
};

interface FormManagerGroupProviderProps {
  children: any;
  groupName: string;
}

const FormManagerGroupProvider = ({
  children,
  groupName,
}: FormManagerGroupProviderProps) => {
  const formManager = useContext(FormManagerContext);
  return (
    <FormManagerGroupContext.Provider
      value={{
        registerField: (fieldName: string) =>
          formManager.registerField(groupName, fieldName),
      }}
    >
      {children}
    </FormManagerGroupContext.Provider>
  );
};

export const FormManager = {
  Manager: FormManagerProvider,
  Group: FormManagerGroupProvider,
  useFormGroupManager: () => useContext(FormManagerGroupContext),
  useFormManager: () => useContext(FormManagerContext),
};
