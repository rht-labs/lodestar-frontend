import React, { useEffect, useState, useContext } from "react";
import { SessionContext } from "../../context/session_context";
import { AuthenticationRepository } from "../../repositories/authentication/authentication_repository";
import { useLocation, Redirect } from "react-router";



export default function CallbackHandler() {
  const query = new URLSearchParams(useLocation().search)
  const code: string | null = query.get('code')
  const ctx = useContext(SessionContext)
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    if (!code) {
      // TODO: handle case where code is not present
      return
    }
    const authRepo = AuthenticationRepository.getInstance()
    authRepo.fetchToken(code).then(async (userToken) => {
      const profile = await authRepo.getUserProfile()
      ctx.performLogin(
        profile,
        userToken,
        profile.groups
      );
      setLoginSuccess(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return loginSuccess ? <Redirect to="/private" /> : null
}


