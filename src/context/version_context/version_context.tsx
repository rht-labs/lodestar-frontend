import React, { createContext, useContext, useState, useCallback } from 'react';
import { Version } from '../../schemas/version_schema';
import { ServiceProviderContext } from '../service_provider_context/service_provider_context';
import { FeedbackContext } from '../feedback_context';

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
  const feedbackContext = useContext(FeedbackContext);
  const fetchVersions = useCallback(async () => {
    feedbackContext.showLoader();
    const versions = await versionService.fetchVersion();
    setVersions(versions);
    feedbackContext.hideLoader();
  }, [versionService, feedbackContext]);

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
