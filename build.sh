#!/bin/sh

set -e
export CI=true

npm install
npm run build
npm run test

cp -R .s2i build/
