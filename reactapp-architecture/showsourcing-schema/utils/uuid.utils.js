const uuidv4 = require('uuid/v4');

// to be sure we use the same uuid version everywhere
function uuid() {
  return uuidv4();
}

module.exports = uuid;