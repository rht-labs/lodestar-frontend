import React, { useContext, useState } from 'react';

export interface FormManagerContext {
  registerField: (groupName: string, fieldName: string) => void;
  fieldGroups: { [key: string]: string[] };
}

const FormManagerContext = React.createContext<FormManagerContext>(null);

export interface FormManagerGroupContext {
  registerField: (fieldName: string) => void;
}
const FormManagerGroupContext = React.createContext<any>(null);

const FormManagerProvider = ({ children }) => {
  const [fieldGroups, setFieldGroups] = useState({});
  const registerField = (groupName: string, fieldName: string) => {
    console.log(`attempting to register ${fieldName} to ${groupName}`);
    if (!fieldGroups[groupName]) {
      setFieldGroups({ ...fieldGroups, [groupName]: [fieldName] });
    } else {
      if (!fieldGroups[groupName].includes(fieldName)) {
        setFieldGroups({
          ...fieldGroups,
          groupName: [...fieldGroups[groupName], fieldName],
        });
      }
    }
  };
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
