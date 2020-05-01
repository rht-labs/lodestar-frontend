import React, { createContext, useContext, useState, useCallback } from 'react';
import { Version } from '../../schemas/version_schema';
import { ServiceProviderContext } from '../service_provider/service_provider_context';

export interface VersionContext {
  fetchVersions: () => void;
  versions?: Version;
}

export const VersionContext = createContext<VersionContext>({
  fetchVersions: async () => {},
});
const { Provider } = VersionContext;
export const VersionProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const { versionService } = useContext(ServiceProviderContext);
  const [versions, setVersions] = useState<Version | undefined>();

  const fetchVersions = useCallback(async () => {
    const versions = await versionService.fetchVersion();
    setVersions(versions);
  }, [versionService]);

  return (
    <Provider
      value={{
        versions,
        fetchVersions,
      }}
    >
      {children}
    </Provider>
  );
};
