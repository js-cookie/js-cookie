#!/bin/bash
if [ "${SAUCE_ACCESS_KEY}" = "false" ]; then
  grunt ci --verbose; else
  npm test
fi
