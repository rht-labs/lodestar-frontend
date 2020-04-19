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

## Development

See [the development README](deployment/README.md) for details on how to spin up a deployment for developing on OpenShift.

## Configuration Variables

Because environment variables are compiled into the built source code of the frontend at build time, it is not possible to dynamically change these values at load time on the client side. In order to allow for dynamic updating of configuration variables, these values must be loaded through a network request from the client side from a static file served separate from the client javascript.

Configuration is set using a json file stored in `config/config.json` of the build directory. The JSON file is loaded via network request on page load. Once the configuration has loaded, the web application renders. This allows a volume to be mounted to `config/config.json` and provide dynamic configuration variables to the client depending on the environment in which the frontend is deployed.

An example `config.json` can be seen in the public folder in `config/config.example.json`.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
