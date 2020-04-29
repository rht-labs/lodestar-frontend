![Build Container](https://github.com/rht-labs/open-management-portal-frontend/workflows/Build%20Container/badge.svg)

# OMP Frontend Quickstart

## Organization

The application is separated into several main components. All of these components are located in folders within `src/`.

### `src/components`

`src/components` contains shared components that can be reused across the application. These include custom components built for OMP specifically, or wrapped components from a third-party library.

In this application, components should be stateless as much as possible. They should not contain business logic.

### `src/context`

`src/context` contains the application contexts. Contexts hold all of the global state and business logic for OMP. For the React docs on Contexts, [see here](https://reactjs.org/docs/context.html).

Contexts serve as the central nervous system for the application. They handle the dirty business of retrieving data from services, processing that data, handling exceptions, storing data, and notifying children of changes. All business logic should flow through a context.

#### Feature Context

The feature context and its associated `Feature` component provide a convenient api for protecting features that require certain roles.

The component is written to mirror major parts of the api of the [Parallel Drive React feature flags implementation](https://github.com/paralleldrive/react-feature-toggles/). Any changes to the external api of either of the feature components should be done after studying the api exposed by the Parallel Drive library.

Currently, features are derived from the session data on session context.

### `src/routes`

`src/routes` holds container-level UI components. Effectively, anything that would be considered a separate screen will likely have a place in the `routes/` folder. Essentially the components in `src/routes` equate to templates in other design patterns.

`routes` orchestrate smaller components into a more meaningful whole. In some cases, `routes` may be responsible for making some calls to `contexts`, such as asking the context to fetch data that the template needs to render properly. Importantly, though, the `route` should delegate data processing and service calls to the `context`. If you are attempting to make a service call from a `route`, take a step back, and consider how to move that call into the context.

### `src/schemas`

`src/schemas` contains the data models that are shared across the application. A `schema` is typically a class with a public interface that encapsulates data. The schema may contain some convenience methods for data routine, small tasks, such as combining `firstName` and `lastName` into `fullName`.

Schemas should not contain significant business logic. Schemas should be ignorant of the services that return them.

### `src/services`

`src/services` encapsulate the dirty details of reaching out to an external service and returning results. Services ought not contain significant business logic; rather, they should be concerned with implementing calls to API's.

Each service is contained in a folder. At the root of the folder is an eponymous file. This file contains the public interface of the service. Any implementer of that interface lives in a folder called `implementations`. This structure allows the contexts to quickly switch between different implementations of the same service.

# The React stuff

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

Regenerate test snapshots using `npm run test -- --updateSnapshot --watchAll=false`.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Environment

ENV variables for the app are listed in `.env-sample` read from an `.env` file at build time.

## OpenShift Container Platform Build and Deployment

For use in an OpenShift Container Platform environment, this appliction is managed by the use of Helm templates. See [the development README](deployment/README.md) for details on how to spin up a deployment for developing on OpenShift.

### Node Build

The Node agent is going to install the npm dependecies, run the tests, build the application, package the output + the Dockerfile, and publish this package to Nexus.

```
npm install

npm run test:ci

npm run build:ci

npm run package

npm run publish
```

### OpenShift Container Platform Build and Deployment

For use in an OpenShift Container Platform environment, this appliction is managed by the use of Helm templates. Please follow the instructions in the [deployment README](deployment) for detailed instructions.

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
| **backendUrl**    | string  | URI for [Backend](https://github.com/rht-labs/open-management-portal-backend.git) APIs | Yes      | N/A     |
| **disableLaunch** | boolean | Flag to toggle launch functionality on/off                                             | Yes      | N/A     |

# Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
