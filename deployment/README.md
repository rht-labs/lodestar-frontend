# Development on OpenShift

## Getting Started With Helm

This directory contains a Helm chart which can be used to deploy a development version of this app for rapid testing.

Before you use it, you will need to download & install Helm 3.

If you are not familiar with Helm - how to configure it and run - you can start with this quickstart:

[https://helm.sh/docs/intro/quickstart](https://helm.sh/docs/intro/quickstart)

## Using This Chart

1. Clone the target repo:

```
git clone https://github.com/rht-labs/lodestar-frontend
```

2. Change into to the `deployment` directory:

```
cd lodestar-frontend/deployment
```

3. Deploy using the following Helm command:

```shell script
helm template . \
  --values values-dev.yaml \
  --set git.uri=https://github.com/rht-labs/lodestar-frontend.git \
  --set git.ref=master \
  --set baseUrl=<your-base-url> \
  --set clientId=<your-sso-client-id> \
  --set authBaseUrl=<your-sso-openid-connect-url> \
  --set realm=<your-realm> \
  --set backendUrl=<your-backend-url> \
  --set 'access.groups[0].name=group-name','access.groups[0].roles={access_type,axxess_type}'
| oc apply -f -
```

It accepts the following variables

| Variable  | Use  |
|---|---|
| `git.uri`  | The HTTPS reference to the repo (your fork!) to build  |
| `git.ref`  | The branch name to build  |
| `baseUrl`  | The FQDN at which this route will be exposed - depends on your environment  |
| `clientId`  | The client ID that the SSO server is configured to accept auth requests using  |
| `realm`  | Realm for SSO integration
| `authBaseUrl`  | The url that your SSO server accepts OpenID Connect requests on - for Keycloak, something like `https://<keycloak-base-url>.com/auth`  |
| `backendUrl`  | The url that the LodeStar backend accepts requests on  |
| `access.groups` | A list of groups to receive access to LodeStar |
| `access.groups[i].roles` | A list of roles to map access | 


This will spin up all of the usual resources that this service needs in production, plus a `BuildConfig` configured to build it from source from the Git repository specified. To trigger this build, use `oc start-build lodestar-frontend`.

**Note**: Also check out the list of runtime variables in the [top level README](../README.md#runtime-configuration-variables)

Included is the ability to run a job that can run the end to end tests and clean up persisted data. A number of values need to be set for this to work.

| Variable  | Use |
|--|--|
| `e2eTestJob.enabled`  | If true it will try to create the job  |
| `e2eTestJob.createSecret` | If true it will try to create the secrets needed for the job  |
| `e2eTestJob.ref`  | The github ref of the repo to run the action against  |
| `e2eTestJob.env.logLevel`  | Sets the log level  |
| `e2eTestJob.env.deleteAfterInHours`  | How stale should the data be to be deleted  |
| `e2eTestJob.env.dryRun`  | Setting to true will delete e2e data  |
| `e2eTestJob.env.gitlabApiUrl`  | The host url for gitlab  |
| `e2eTestJob.env.parentGroupId`  | The repo id of the e2e customer   |
| `e2eTestJob.env.gitlabToken`  | The token for gitlab access  |
| `e2eTestJob.env.githubApiUrl`  | The api to the github action  |
| `e2eTestJob.env.githubToken`  | The token ofr github access  |
