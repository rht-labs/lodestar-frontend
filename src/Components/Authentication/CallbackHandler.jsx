import React, { useEffect, useState, useContext } from "react";
import { SessionContext } from "../../Context/sessionContext";
import { AuthenticationRepository } from "../../repositories/authentication/authentication_repository";
import { useLocation, Redirect } from "react-router";



export default function CallbackHandler() {
  const query = new URLSearchParams(useLocation().search)
  const code = query.get('code')
  const ctx = useContext(SessionContext)
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    const authRepo = AuthenticationRepository.getInstance()
    authRepo.fetchToken(code).then(async (userToken) => {
      const profile = authRepo.getUserProfile()
      ctx.performLogin({
        profile,
        userToken,
        roles: profile.groups
      });
      setLoginSuccess(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return loginSuccess ? <Redirect to="/private" /> : null
}


