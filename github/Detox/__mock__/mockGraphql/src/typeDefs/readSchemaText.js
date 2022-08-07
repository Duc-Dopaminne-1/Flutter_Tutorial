const fs = require('fs');

require.extensions['.txt'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const schemaText = require('./schema.txt');
module.exports = schemaText;
