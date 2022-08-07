
const supplierStatuses = {
  "_Onboarding": { name: "Onboarding", category: "inProgress", inWorkflow: true, step: 1, deleted: false },
  "_Validated" : { name: "Validated", category: "validated", inWorkflow: false , step: 2, deleted: false },
  "_Refused"   : { name: "Refused", category: "refused", inWorkflow: false, step: 3, deleted: false }
};


const supplierTypes = {
  "_Manufacturer": { name: "Manufacturer", deleted: false },
  "_Supplier":     { name: "Supplier", deleted: false },
  "_Trader":       { name: "Trader", deleted: false }
};


const productStatuses = {
  "_GetQuotation":   { name: "Get quotation", category: "inProgress", inWorkflow: true, step: 1, deleted: false },
  "_ValidateSample": { name: "Validate sample", category: "inProgress", inWorkflow: true, step: 2, deleted: false },
  "_TeamReview":     { name: "Team review", category: "inProgress", inWorkflow: true, step: 3, deleted: false },
  "_Validated":      { name: "Validated", category: "validated", inWorkflow: false, step: 4, deleted: false },
  "_Refused":        { name: "Refused", category: "refused", inWorkflow: false, step: 5, deleted: false }
};

const sampleStatuses = {
  "_toOrder":         { name: "To order", category: "preparation", inWorkflow: true, step: 1, deleted: false },
  "_Ordered":         { name: "Ordered", category: "preparation", inWorkflow: true, step: 2, deleted: false },
  "_Received":        { name: "Received", category: "inProgress", inWorkflow: true, step: 3, deleted: false },
  "_UnderAssessment": { name: "Under Assessment", category: "inProgress", inWorkflow: true, step: 4, deleted: false },
  "_Validated":       { name: "Validated", category: "validated", inWorkflow: true, step: 5, deleted: false },
  "_Refused":         { name: "Refused", category: "refused", inWorkflow: false, step: 6, deleted: false }
};

const taskTypes = {
  "_Quotation":         { name: "Quotation", deleted: false },
  "_getSample":         { name: "Get sample", deleted: false },
  "_SupplierCatalogue": { name: "Supplier Catalogue", deleted: false },
  "Custom":             { name: "Custom", deleted: false },
};


module.exports = {
  supplierStatuses:supplierStatuses,
  sampleStatuses:sampleStatuses,
  supplierTypes,
  productStatuses:productStatuses,
  taskTypes:taskTypes
};
