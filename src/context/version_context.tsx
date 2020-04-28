import React, { createContext, useContext, useState, useCallback } from 'react';
import { Version } from '../schemas/version_schema';
import { Apiv1VersionService } from '../services/version_service/implementations/apiv1_version_service';
import { ConfigContext } from './config_context';
import { SessionContext } from './session_context';


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
  const configContext = useContext(ConfigContext);
  const sessionContext = useContext(SessionContext);
  const versionRepository = new Apiv1VersionService({
    baseUrl: configContext.appConfig?.backendUrl,
    axios: sessionContext.axios,
  });

  const [versions, setVersions] = useState<Version| undefined>();

const fetchVersions = useCallback(async () => {
  const versions = await versionRepository.fetchVersion();
  setVersions(versions);
}, [versionRepository]);

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
