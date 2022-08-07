const Defaults = require('./defaults')
const JsonSchema = require('./json_schema')
const Helpers = require('./helpers')

module.exports = {
  jsonSchema: JsonSchema,
  product: Defaults.product,
  supplier: Defaults.supplier,
  helpers: Helpers,
  toRealmSchema: Helpers.updateRealmSchema
}

