#!/bin/bash

set -e

if [ -n "$INPUT_TOKEN" ]; then GITHUB_TOKEN="$INPUT_TOKEN"; fi
if [ -n "$INPUT_FUTURE_RELEASE_TAG" ]; then FUTURE_TAG="$INPUT_FUTURE_RELEASE_TAG"; fi
if [ -n "$INPUT_PREVIOUS_RELEASE_TAG" ]; then PREVIOUS_TAG="$INPUT_PREVIOUS_RELEASE_TAG"; fi

node generate-changelogs.mjs
