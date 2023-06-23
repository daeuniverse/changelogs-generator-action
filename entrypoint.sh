#!/bin/bash

set -e

APP_DIR=/app

if [ -n "$INPUT_TOKEN" ]; then GITHUB_TOKEN="$INPUT_TOKEN"; fi
if [ -n "$INPUT_FUTURERELEASE" ]; then FUTURE_TAG="$INPUT_FUTURERELEASE"; fi
if [ -n "$INPUT_PREVIOUSRELEASE" ]; then PREVIOUS_TAG="$INPUT_PREVIOUSRELEASE"; fi

echo $PREVIOUS_TAG
echo $FUTURE_TAG

node ${APP_DIR}/index.js
