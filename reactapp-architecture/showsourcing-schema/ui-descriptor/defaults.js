const defaultProductDescriptor = {
  fieldSets: [{ name: "Product", cols: [
    { name: "name", displayType: "text", realmType: "string", required: true, multiple: false },
    { name: "supplier", label: "Supplier", displayType: "selector", realmType: "Supplier", metadata: {canCreate: false, propertyName: "name"}},
    { name: "images", displayType: "image", realmType: "Image", multiple: true }
  ]}]
};

const defaultSupplierDescriptor = {
  fieldSets: [{ name: "Supplier", cols: [
  ]}]
};

module.exports = {
  product: defaultProductDescriptor,
  supplier: defaultSupplierDescriptor
}