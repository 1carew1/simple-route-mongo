#!/bin/bash
set -x
npm run build
cd build
mkdir simple-route
cp -r static simple-route/
cp favicon.ico simple-route/
cp asset-manifest.json simple-route/
cd ..
yes | rm -r ../public/*
cp -r build/* ../public