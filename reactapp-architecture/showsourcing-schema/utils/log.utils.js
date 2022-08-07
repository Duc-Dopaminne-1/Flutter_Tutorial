const colors = require('./colors.utils');

function log(msg, color = colors.yellow) {
  // if ( logLvl >== x)
  // eslint-disable-next-line no-console
  console.log(color, msg, colors.white);
}

function logError(msg) {
  // Save error with context to DB or do w.e

  // if ( logLvl >== x)
  // eslint-disable-next-line no-console
  console.error(msg);
}

function logDebug(msg) {
  // eslint-disable-next-line no-console
  console.debug(colors.cyan, '    ', msg, new Date(), colors.white);
}

module.exports = {
  log,
  logDebug,
  logError
};

