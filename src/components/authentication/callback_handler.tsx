import React, { useEffect, useState, useContext } from 'react';
import { SessionContext } from '../../context/session_context';
import { useLocation, Redirect } from 'react-router';
import { ConfigContext } from '../../context/config_context';
import { ApiV1AuthenticationRepository } from '../../repositories/authentication/implementations/api_v1_repository';

export const CallbackHandler = () => {
  const query = new URLSearchParams(useLocation().search);
  const code: string | null = query.get('code');
  const ctx = useContext(SessionContext);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const configContext = useContext(ConfigContext);

  useEffect(() => {
    if (!code) {
      // TODO: handle case where code is not present
      return;
    }
    const authRepo = new ApiV1AuthenticationRepository(configContext);
    authRepo.fetchToken(code, 'authorization_code').then(async userToken => {
      const profile = await authRepo.getUserProfile();
      ctx.performLogin(profile, userToken, profile.groups as string[]);
      setLoginSuccess(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return loginSuccess ? <Redirect to="/" /> : null;
};
