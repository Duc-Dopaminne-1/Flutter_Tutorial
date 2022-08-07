function replaceProperties(realmClass, properties) {
  let newClass = Object.assign({}, realmClass);
  newClass.properties = properties;
  return newClass;
}

module.exports = {
  withCustomFields: function(schema, productFields, supplierFields) {
    return schema.map((realmClass) => {
      switch (realmClass["name"]) {
        case "Product": return replaceProperties(realmClass, productFields);
        case "Supplier": return replaceProperties(realmClass, supplierFields);
        default: return realmClass;
      }
    });
  }
}