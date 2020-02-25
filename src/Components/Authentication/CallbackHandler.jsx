import React, { useEffect } from "react";
import axios from "axios";
import { SessionContext } from "../../Context/sessionContext";
import { UserProfile } from "../../models/user_profile";
import { AuthenticationRepository } from "../../repositories/authentication/authentication_repository";
import { UserToken } from "../../models/user_token";
import qs from 'querystring'
import { useLocation, Redirect } from "react-router";
import { useContext } from "react";
import { useState } from "react";
import { AppSettings } from "../../settings/config";



export default function CallbackHandler() {
  const query = new URLSearchParams(useLocation().search)
  const code = query.get('code')
  const ctx = useContext(SessionContext)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const requestParams = {
    code,
    grant_type: 'authorization_code',
    client_id: AppSettings.clientId,
    redirect_uri: `${AppSettings.baseUrl}/auth_callback`
  }
  const tokenUrl = `${AppSettings.authBaseUrl}/token`
  useEffect(() => {
    axios.post(tokenUrl, qs.stringify(requestParams), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': AppSettings.baseUrl,
        'Accept': '*/*'
      },
    }).then(async ({ data }) => {
      const { access_token, refresh_token, expires_in, refresh_expires_in } = data
      const userProfileData = await axios.get(`${AppSettings.authBaseUrl}/userinfo`, { headers: { Authorization: `Bearer ${access_token}` } })
      let currentTime = new Date();
      ctx.performLogin({
        profile: new UserProfile({
          username: userProfileData.data.preferred_username,
          firstName: userProfileData.data.given_name,
          lastName: userProfileData.data.family_name,
          email: userProfileData.data.email
        }),
        userToken: AuthenticationRepository.getInstance().saveToken(new UserToken({
          accessToken: access_token,
          refreshToken: refresh_token,
          accessTokenExpiry: new Date(
            currentTime.getTime() + expires_in * 1000
          ),
          refreshTokenExpiry: new Date(
            currentTime.getTime() +
            refresh_expires_in * 1000
          )
        })),
        roles: userProfileData.data.groups
      });
      setLoginSuccess(true)
    })
  }, [])
  return loginSuccess ? <Redirect to="/private" /> : null
}


