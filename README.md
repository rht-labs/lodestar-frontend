![Build Container](https://github.com/rht-labs/lodestar-frontend/workflows/Build%20Container/badge.svg)

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=rht-lodestar-frontend&metric=coverage)](https://sonarcloud.io/dashboard?id=rht-lodestar-frontend)

# Lodestar Frontend Quickstart

## First things first

The following technologies are used in this application:

1. [React](https://reactjs.org/docs/getting-started.html)
1. [React Hooks](https://reactjs.org/docs/hooks-intro.html)
1. [Provider/Consumer and React Contexts](https://reactjs.org/docs/context.html)
1. [Patternfly](https://www.patternfly.org/v4/documentation/react/overview/release-notes)
1. [Typescript](https://www.typescriptlang.org/docs/)
1. [Jest](https://jestjs.io/docs/en/tutorial-react)
1. [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
1. [Cypress](http://cypress.io/)
1. [React Router](https://reacttraining.com/react-router/)

### Style

GTS is used as the styleguide for the application.
Code that does not conform to the styleguide will fail PR tests.
Before submitting a PR, confirm that your code passes the style check by running
`npm run check`.

Additionally, you can attempt to automatically fix any style errors in your code by running:
`npm run fix`. _Pro tip: commit any changes you have before running any script that may modify your source files._

## General Architecture

This application follows a typical three-tier application design. These three terms can be generally divided into Services which manage communication with external data sources (e.g. REST APIs); Contexts, which contain business logic; and Presentation, which contains the user interface and associated presentation state. 

Contexts are the mediator between the presentation and the services providing data. Data manipulation should be handled to the extent reasonable in the Context layer.

Services should only return data with known interfaces. That is, it is the services responsibility to serialize data from an external source's format into an interface that is recognized within the application. 

By extension, Contexts should not work with unknown data types, nor should they be responsible for preparing data to be sent to an external service.

Once data has reached a Context, its shape should be known in the application. The Context and Presentation layer uses this known data to perform their respective roles.

In order to facilitate serialization of common interfaces across services, a shared serializer interface has been created which can be extended for new data types as they become available. Services can define serializers for their service within their own service module, or within the `serializers/` directory.

As a high-level overview, data flow through the system typically follows this pattern:

![Front End data flow](/documentation/FE_architecture.png?raw=true)

## Tests

Unit Tests are contained within the source code, rather than in a separate root `test` directory. Typically, tests will be included in a directory `__tests__` at the level of the code they are testing. 
As contexts are responsible for most data manipulation operations that occur in the application, special care should be taken to ensure high test coverage of the contexts.

Integration tests are contained in their own root level directory `e2e`.

## Organization

The application is separated into several main components. All of these components are located in folders within `src/`.

### `src/components`

`src/components` contains shared components that can be reused across the application. These include custom components built for Lodestar specifically, or wrapped components from a third-party library.

In this application, components should be stateless as much as possible. They should not contain business logic.

### `src/context`

`src/context` contains the application contexts. Contexts hold all of the global state and business logic for Lodestar. For the React docs on Contexts, [see here](https://reactjs.org/docs/context.html).

Contexts serve as the central nervous system for the application. They handle the dirty business of retrieving data from services, processing that data, handling exceptions, storing data, and notifying children of changes. All business logic should flow through a context.

#### Feature Context

The feature context and its associated `Feature` component provide a convenient api for protecting features that require certain roles.

The component is written to mirror major parts of the api of the [Parallel Drive React feature flags implementation](https://github.com/paralleldrive/react-feature-toggles/). Any changes to the external api of either of the feature components should be done after studying the api exposed by the Parallel Drive library.

Currently, features are derived from the session data on session context.

#### Service Provider Context

The service provider context acts as a dependency injector for asynchronous services into the application.
By default, the service provider provides the production services.
You can switch to faked services by passing an environment variable: `REACT_APP_USE_FAKED=true`.

### `src/routes`

`src/routes` holds container-level UI components. Effectively, anything that would be considered a separate screen will likely have a place in the `routes/` folder. Essentially the components in `src/routes` equate to templates in other design patterns.

`routes` orchestrate smaller components into a more meaningful whole. In some cases, `routes` may be responsible for making some calls to `contexts`, such as asking the context to fetch data that the template needs to render properly. Importantly, though, the `route` should delegate data processing and service calls to the `context`. If you are attempting to make a service call from a `route`, take a step back, and consider how to move that call into the context.

### `src/schemas`

`src/schemas` contains the data models that are shared across the application. A `schema` is typically a class with a public interface that encapsulates data. The schema may contain some convenience methods for data routine, small tasks, such as combining `firstName` and `lastName` into `fullName`.

Schemas should not contain significant business logic. Schemas should be ignorant of the services that return them.

### `src/services`

`src/services` encapsulate the dirty details of reaching out to an external service and returning results. Services ought not contain significant business logic; rather, they should be concerned with implementing calls to API's.

Each service is contained in a folder. At the root of the folder is an eponymous file. This file contains the public interface of the service. Any implementer of that interface lives in a folder called `implementations`. This structure allows the contexts to quickly switch between different implementations of the same service.

## Development

### Logging

This repository reimplements several common methods from the `console` interface. Any output that needs to be logged must be logged through this interface. The logger can be imported from `src/utilities/logger/index.ts`.

**BAD:**

```typescript
async function myAsynchronousFunction() {
  try {
    await myAsynchronousTask();
  } catch (e) {
    console.error(e);
    // handle MyError
  }
}
```

**GOOD:**

```typescript
import { Logger } from './src/utilities/logger';

async function myAsynchronousFunction() {
  try {
    await myAsynchronousTask();
  } catch (e) {
    Logger.instance.error(e);
    // handle MyError
  }
}
```

Use good judgment when creating console logs. As a rule, any error or unexpected behavior that is caught in the application should be logged with `Logger.instance.error`. **Do not silence errors**. `debug` and `info` are additional log levels to choose from. `debug` is the noisiest level, with `info` being less noisy.

#### Logging Config Variables

The logger can be set with values in `config.json`. Available log types are defined in `src/utilities/logger/index.ts`. Log Verbosity is an enum defined in `src/utilities/logger/logger.ts`. To set this value, set the config value defined in `config.example.json` to the desired log verbosity.

### `Feeback System`

User feedback is generated through the FeedbackContext which can be imported from `src/context/feedback_context/feedback_context`.  
This exposes the following methods:

- showLoader()
- hideLoader()
- showAlert(msg:string, value:string, timed:boolean = true)
- hideAlert()

**Example Usage:**  
Import the context into your component like so:

```javascript
import React, { useContext } from 'react';
import { FeedbackContext } from './src/context/feedback_context/feedback_context';

const feedbackContext = useContext(FeedbackContext);
```

once properly imported, the methods can be implemented where needed as follows:

```javascript
feedbackContext.showLoader();
feedbackContext.showAlert("this is my alert message", "error OR success", defaults to true );
feedbackContext.hideAlert();
feedbackContext.hideLoader();
```

Loaders should be applied to all async operations and page transitions.  
Alerts should be utilized for all user interactions outside of navigation. (Saves, Launches, Creates)

# The React stuff

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

<!-- markdown-link-check-disable -->

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

<!-- markdown-link-check-enable -->

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

Regenerate test snapshots using `npm run test -- --updateSnapshot --watchAll=false`.

### `npm run e2e`

Launches the e2e test runner in the interactive watch mode. See this section about the [test runner](https://docs.cypress.io/guides/core-concepts/test-runner.html#Overview) for more information. Sensitive env variables should be set on the command or by export. Do not check in.

Suggested:

```
export CYPRESS_BASE_URL=fe-env-url
export CYPRESS_SSO_USER=e2e
export CYPRESS_SSO_PASSWORD=****
export CYPRESS_SSO_URL=sso_url
export CYPRESS_SSO_CLIENT_ID=client_id
npm run e2e
```
For running the e2e test locally:

```
export CYPRESS_BASE_URL=http://localhost:3000
export CYPRESS_SSO_USER=<<e2e>>
export CYPRESS_SSO_PASSWORD=****
export CYPRESS_SSO_URL=<<https://sso_host >>/auth/realms/<< realm name>>/protocol/openid-connect/token
export CYPRESS_SSO_CLIENT_ID=<<client_id>>
npm run e2e
```

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Environment

ENV variables for the app are listed in `.env-sample` read from an `.env` file at build time.

## OpenShift Container Platform Build and Deployment

For use in an OpenShift Container Platform environment, this appliction is managed by the use of Helm templates. See [the development README](deployment/README.md) for details on how to spin up a deployment for developing on OpenShift.

### Node Build

The Node agent is going to install the npm dependecies, run the tests, build the application, package the output + the Dockerfile, and publish this package to Nexus.

```bash
npm install

npm run test:ci

npm run build:ci

npm run package

npm run publish
```

## Fields required to be populated to allow launch

An engagement cannot be launched until the following fields are populated for that engagement:

| Variable                   | Section           | Description                                  |
| :------------------------- | :---------------- | :------------------------------------------- |
| **Customer Name**          | Basic             | The name of the customer for this engagement |
| **Project Name**           | Basic             | The name of this engagements project         |
| **Residency Date (Start)** | Basic             | The start date of the engagement             |
| **Residency Date (End)**   | Basic             | The start date of the engagement             |
| **Labs EL**                | Point of Contact  | The name and email for the Engagement Lead   |
| **Labs Technical Lead**    | Point of Contact  | The name and email for the Technical Lead    |
| **Customer Contact**       | Point of Contact  | The name and email for the client contact    |
| **Cloud Provider**         | OpenShift Cluster | Which cloud provider is being utilized       |
| **Provider Region**        | OpenShift Cluster | Which region is this cloud hosted            |
| **Open Shift Version**     | OpenShift Cluster | Which version of OpenShift is required       |
| **Desired Subdomain**      | OpenShift Cluster | What is the desired path for the cluster     |
| **Persistent Storage**     | OpenShift Cluster | What are the storage requirements            |
| **Cluster Size**           | OpenShift Cluster | What is the size of the cluter               |

## Configuration Variables for local deployments

Because environment variables are compiled into the built source code of the frontend at build time, it is not possible to dynamically change these values at load time on the client side. In order to allow for dynamic updating of configuration variables, these values must be loaded through a network request from the client side from a static file served separate from the client javascript.

Configuration is set using a json file stored in `config/config.json` of the build directory. The JSON file is loaded via network request on page load. Once the configuration has loaded, the web application renders. This allows a volume to be mounted to `config/config.json` and provide dynamic configuration variables to the client depending on the environment in which the frontend is deployed.

An example `config.json` can be seen in [public/config/config.example.json](public/config/config.example.json).

For more descriptions of each variable, please see the [Runtime Configuration Variables](#runtime-configuration-variables) section below.

## Runtime Configuration Variables

Depending on the type of deployment, the way of setting these variables may vary. However done, the following values are options that can be set to succesfully run the frontend:

| Variable          | Type    | Description                                                                            | Required | Default |
| :---------------- | :------ | :------------------------------------------------------------------------------------- | :------- | :------ |
| **baseUrl**       | string  | Target URL for the deployment of **this** Frontend App                                 | Yes      | N/A     |
| **authBaseUrl**   | string  | URI for SSO integration                                                                | Yes      | N/A     |
| **clientId**      | string  | Identification of the client application for SSO integration                           | Yes      | N/A     |
| **backendUrl**    | string  | URI for [Backend](https://github.com/rht-labs/lodestar-backend.git) APIs | Yes      | N/A     |
| **disableLaunch** | boolean | Flag to toggle launch functionality on/off                                             | Yes      | N/A     |

# Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
