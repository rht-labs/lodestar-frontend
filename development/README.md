# Development on OpenShift

This directory contains a Helm chart which can be used to deploy a development version of this app for rapid testing.

Before you use it, you will need to download & install Helm 3.

To use it, move to the `development` directory (i.e. `cd development/`), and deploy using the following Helm command:

```shell script
helm template . \
  --set git.uri=https://github.com/rht-labs/open-management-portal-frontend.git \
  --set git.ref=master \
  --set baseUrl=<your-base-url> \
  --set clientId=<your-sso-client-id> \
  --set authBaseUrl=<your-sso-openid-connect-url> \
  --set backendUrl=<your-backend-url> \
| oc apply -f -
```

It accepts the following variables

| Variable  | Use  |
|---|---|
| `git.uri`  | The HTTPS reference to the repo (your fork!) to build  |
| `git.ref`  | The branch name to build  |
| `baseUrl`  | The FQDN at which this route will be exposed - depends on your environment  |
| `clientId`  | The client ID that the SSO server is configured to accept auth requests using  |
| `authBaseUrl`  | The url that your SSO server accepts OpenID Connect requests on - for Keycloak, something like `https://<keycloak-base-url>.com/auth/realms/<realm-id>/protocol/openid-connect`  |
| `backendUrl`  | The url that the Open Management Portal backend accepts requests on  |

This will spin up all of the usual resources that this service needs in production, plus a `BuildConfig` configured to build it from source from the Git repository specified. To trigger this build, use `oc start-build omp-frontend`.