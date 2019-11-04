# Open Management Portal - Frontend

> The user-facing components of the Open Management Portal.

## Components

This project was built using Nuxt.js - a framework surrounding Vue. For more information, visit [Nuxt.js docs](https://nuxtjs.org).

UI elements are from [Patternfly 4](https://www.patternfly.org/v4/).

The server-side components are written in TypeScript.

## Build Setup

The linter (ESLint) and style checker (Prettier) are currently enabled and **very strict**. New code must conform to style guidelines before a build will succeed. Editors such as VSCode should help with this. This is to ensure continued quality of the codebase.

## Testing

This project uses Jest for unit and snapshot testing. Snapshot testing is for the detection of unintended UI changes; however, if you _intentionally_ change a UI element, the snapshot test for that element will _fail_. Make sure to always update snapshots before committing if this is the case.

## Useful Commands

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:8080
$ yarn dev

# run unit & snapshot tests
$ yarn test

# update snapshot tests (if you've changed a UI element intentionally and have verified yourself that it renders correctly)
$ yarn test --updateSnapshot

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```
