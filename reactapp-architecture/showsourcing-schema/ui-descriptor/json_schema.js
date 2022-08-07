module.exports = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "UIDescriptor",
  "description": "Showsourcing custom fields ui descriptor",
  "type": "object",
  "properties": {
    "fieldSets": {
      "type": "array",
      "items": { "$ref": "#/definitions/FieldSet" }
    }
  },
  "required": [ "fieldSets" ],
  "definitions": {
    "CustomField": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "displayType": {},
        "realmType": { "type": "string" },
        "metadata": { "type": "object" },
        "label": { "type": "string" },
        "placeholder": { "type": "string" },
        "required": { "type": "boolean" },
        "multiple": { "type": "boolean" }
      },
      "required": ["name", "realmType"]
    },
    "FieldSet": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "cols": { "type": "array", "items": { "$ref": "#/definitions/CustomField" } }
      },
      "required": ["name", "cols"]
    }
  }
}
