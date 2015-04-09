#!/bin/bash
if [ -z "$SAUCE_ACCESS_KEY" ]; then
  npm test
else
  grunt ci --verbose
fi
