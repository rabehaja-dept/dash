#!/usr/bin/env bash

# cd into root
cd ..

# install global dependencies
npm install

npm install --prefix cdk-webapp
npm install --prefix demo
npm install --prefix init

# install stack dependencies
npm install --prefix ./stack

# cd into stack
cd stack

# install stack dependencies
npm install --prefix cdk
npm install --prefix contentful
npm install --prefix commercetools
npm install --prefix kontent.ai
npm install --prefix strapi
npm install --prefix scripts

# copy and rename .env.example to .env
cp .envrc.example .envrc
