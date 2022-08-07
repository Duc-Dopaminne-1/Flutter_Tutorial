#!/usr/bin/env node

const json = require('../package.json');

const version = json.version;

// eslint-disable-next-line no-console
console.log(version);
