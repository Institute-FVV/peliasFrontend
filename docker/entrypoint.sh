#!/bin/bash

# build node app again with current present docker .env variables
npm run build

# publish app
npm run start:server