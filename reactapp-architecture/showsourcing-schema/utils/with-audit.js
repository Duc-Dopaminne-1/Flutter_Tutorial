


function withAudit(model) {
  let new_model = Object.assign({}, model);
  new_model.properties = Object.assign({}, model.properties);
  new_model.properties.creationDate = 'date';
  new_model.properties.createdBy = 'User';
  new_model.properties.deletedBy = 'User?';
  new_model.properties.deletionDate = 'date?';
  new_model.properties.lastUpdatedBy = 'User?';
  new_model.properties.lastUpdatedDate = 'date';
  new_model.properties.deleted = {type: 'bool', default: false };
  return new_model;
}

module.exports = withAudit;
