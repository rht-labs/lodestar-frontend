import React, { createContext, useContext, useState, useCallback } from 'react';
import { Version } from '../../schemas/version_schema';
import { useServiceProviders } from '../service_provider_context/service_provider_context';
import { useFeedback } from '../feedback_context';
import { useSession } from '../session_context/session_context';
import {
  AuthorizationError,
  AuthenticationError,
} from '../session_context/session_errors';

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
  const { versionService } = useServiceProviders();
  const sessionContext = useSession();
  const [versions, setVersions] = useState<Version | undefined>();
  const _handleErrors = useCallback(
    e => {
      if (e instanceof AuthorizationError || e instanceof AuthenticationError) {
        sessionContext.checkAuthStatus();
      } else {
        throw e;
      }
    },
    [sessionContext]
  );
  const feedbackContext = useFeedback();
  const fetchVersions = useCallback(async () => {
    try {
      feedbackContext.showLoader();
      const versions = await versionService.fetchVersion();
      setVersions(versions);
      feedbackContext.hideLoader();
    } catch (e) {
      try {
        _handleErrors(e);
      } catch (e) {
        throw e;
      }
    }
  }, [versionService, feedbackContext, _handleErrors]);

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
