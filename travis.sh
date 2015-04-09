#!/bin/bash
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  grunt ci --verbose; else
  npm test
fi