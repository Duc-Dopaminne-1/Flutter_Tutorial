#!/usr/bin/env node

const args = process.argv.slice(2);

const buildNumber = args[0];

const major = buildNumber.substring(2, 4);
const minor = buildNumber.substring(4, 8);
const patch = buildNumber.split('.')[1];

const version = `${major}.${parseInt(minor, 10)}.${patch}`;

// eslint-disable-next-line no-console
console.log(version);
