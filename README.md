This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Environment

ENV variables for the app are listed in `.env-sample` read from an `.env` file at build time.

### Openshift Applier

This project includes an `openshift-applier` inventory. To use it, make sure that you are logged in to the cluster and that you customize the variables in `.applier/inventory/group_vars/all.yml` - namely make sure that `deploy_vars` uses the correct endpoints. Once these are configured, you can deploy the project with:

```bash
$ cd .applier/

$ ansible-galaxy install -r requirements.yml --roles-path=roles --force

$ ansible-playbook apply.yml -i inventory/
```

## Development

See [the development README](development/README.md) for details on how to spin up a deployment for developing on OpenShift.

## Pipeline

The deployment pipeline is running through a `Jenkinsfile` located in the root folder of the project. This `Jenksinfile` is written in groovy.
The pipeline expects the nexus is available nexus:8080. Make sure that nexus is available and accessible to Jenkins.

#### Prepare environment for [ENVIRONMENT] deploy

The first stage is going to set environment vars based on the branch selected to build:

```groovy
master - env.PROJECT_NAMESPACE = "${NAMESPACE_PREFIX}-test"
         env.NODE_ENV = "test"
         env.RELEASE = true
         env.REACT_APP_BACKEND_URI = "https://omp-backend-omp-test.apps.s11.core.rht-labs.com"

develop.* or feature.* - env.PROJECT_NAMESPACE = "${NAMESPACE_PREFIX}-dev"
	                     env.NODE_ENV = "dev"
	                     env.REACT_APP_BACKEND_URI = "https://omp-backend-omp-dev.apps.s11.core.rht-labs.com"
```

#### Ansible

Jenkins will spin up an Ansible agent that will run a playbook called OpenShift Applier (https://github.com/redhat-cop/openshift-applier). The openshift-applier is used to apply OpenShift objects to an OpenShift Cluster. 

This stage is going to download the playbook dependencies using Ansible Galaxy and apply the playbook using **build** as a *filter_tag*. This is going to create the necessary resources for our application build in an OpenShift cluster. 

#### Test/Node Build/Nexus/OpenShift Build

Jenkins will spin up a Node agent to test, Node build, upload to Nexus and start the OpenShift build.

##### Node Build

The Node agent is going to install the npm dependecies, run the tests, build the application, package the output + the Dockerfile, and publish this package to Nexus.

```
npm install

npm run test:ci

npm run build:ci

npm run package

npm run publish
```

##### OpenShift Build

Jenkins is going to cleanup any old package-contents folder and download the new one from Nexus. From there is going to trigger the binary build in OpenShift using the uncompressed directory.

```
rm -rf package-contents*
curl -v -f http://admin:admin123@${NEXUS_SERVICE_HOST}:${NEXUS_SERVICE_PORT}/repository/zip/com/redhat/omp-frontend/${JENKINS_TAG}/package-contents.zip -o package-contents.zip
unzip -o package-contents.zip
```

###### OpenShift Atomic Registry

If you're pushing from the master branch the build will create a container image and push it to the Openshift internal registry.

```
oc project ${PIPELINES_NAMESPACE}
oc patch bc ${APP_NAME} -p "{\\"spec\\":{\\"output\\":{\\"to\\":{\\"kind\\":\\"ImageStreamTag\\",\\"name\\":\\"${APP_NAME}:${JENKINS_TAG}\\"}}}}"
oc start-build ${APP_NAME} --from-dir=package-contents/ --follow
```

###### Quay

If you're pushing from a release tag the build will create a container image and push it to Quay.

```
oc project ${PIPELINES_NAMESPACE} # probs not needed
oc patch bc ${APP_NAME} -p "{\\"spec\\":{\\"output\\":{\\"to\\":{\\"kind\\":\\"DockerImage\\",\\"name\\":\\"quay.io/rht-labs/${APP_NAME}:${JENKINS_TAG}\\"}}}}"
oc start-build ${APP_NAME} --from-dir=package-contents/ --follow
```


#### OpenShift Deployment

Jenkins will spin up an Ansible agent that will run a playbook called OpenShift Applier (https://github.com/redhat-cop/openshift-applier). The `openshift-applier` is used to apply OpenShift objects to an OpenShift Cluster. 

This agent is going to download the playbook dependencies using Ansible Galaxy and apply the playbook using **environment** as a *filter_tag*. This is going to create the necessary resources for our application deploy in an OpenShift cluster. 

Once the resources are ready the pipeline is going to patch the DC with the new image and start a rollout deployment.

```
oc set env dc ${APP_NAME} NODE_ENV=${NODE_ENV}
oc set image dc/${APP_NAME} ${APP_NAME}=docker-registry.default.svc:5000/${PROJECT_NAMESPACE}/${APP_NAME}:${JENKINS_TAG}
oc label --overwrite dc ${APP_NAME} stage=${NODE_ENV}
oc patch dc ${APP_NAME} -p "{\\"spec\\":{\\"template\\":{\\"metadata\\":{\\"labels\\":{\\"version\\":\\"${PACKAGE_JSON_VERSION}\\",\\"release\\":\\"${RELEASE}\\",\\"stage\\":\\"${NODE_ENV}\\",\\"git-commit\\":\\"${GIT_COMMIT}\\",\\"jenkins-build\\":\\"${JENKINS_TAG}\\"}}}}}"
oc rollout latest dc/${APP_NAME}
```

#### Configuration Variables

Because environment variables are compiled into the built source code of the frontend at build time, it is not possible to dynamically change these values at load time on the client side. In order to allow for dynamic updating of configuration variables, these values must be loaded through a network request from the client side from a static file served separate from the client javascript.

Configuration is set using a json file stored in `config/config.json` of the build directory. The JSON file is loaded via network request on page load. Once the configuration has loaded, the web application renders. This allows a volume to be mounted to `config/config.json` and provide dynamic configuration variables to the client depending on the environment in which the frontend is deployed.

An example `config.json` can be seen in the public folder in `config/config.example.json`.


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
