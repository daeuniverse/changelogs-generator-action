#!/bin/bash

set -e

if [ -n "$INPUT_TOKEN" ]; then GITHUB_TOKEN="$INPUT_TOKEN"; fi
if [ -n "$INPUT_FUTURERELEASE" ]; then FUTURE_TAG="$INPUT_FUTURERELEASE"; fi
if [ -n "$INPUT_PREVIOUSRELEASE" ]; then PREVIOUS_TAG="$INPUT_PREVIOUSRELEASE"; fi

node generate-changelogs.mjs
