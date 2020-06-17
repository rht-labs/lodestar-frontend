#!/bin/sh

set -e
export CI=true

npm install
npm run test
npm run build

cp -R .s2i build/
