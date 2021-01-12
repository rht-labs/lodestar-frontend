import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppVersion, Version } from '../../schemas/version';
import { useFeedback } from '../feedback_context/feedback_context';
import { VersionService } from '../../services/version_service/version_service';

export interface IVersionContext {
  fetchVersions: () => void;
  versions?: AppVersion;
}

export const VersionContext = createContext<IVersionContext>({
  fetchVersions: async () => {},
});
const { Provider } = VersionContext;
export const VersionProvider = ({
  children,
  versionService,
}: {
  children: React.ReactChild;
  versionService: VersionService;
}) => {
  const [versions, setVersions] = useState<Version | undefined>();
  const feedbackContext = useFeedback();
  const fetchVersions = useCallback(async () => {
    try {
      feedbackContext.showLoader();
      const versions = await versionService.fetchVersion();
      setVersions(versions);
      feedbackContext.hideLoader();
    } catch (e) {
      console.log(e);
    }
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

export const useVersion = () => useContext(VersionContext);
