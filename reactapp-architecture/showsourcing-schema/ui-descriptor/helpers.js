function* walkDescriptor(descriptor)  {
  for(const fieldSet of descriptor.fieldSets) {
    yield* fieldSet.cols;
  }
}

function getCompleteRealmType(customField) {
  if(customField.multiple) {
    return customField.realmType+"[]";
  } else {
    return customField.realmType+"?";
  }
}

function updateRealmSchema(realmSchema, descriptor) {
  for(const customField of walkDescriptor(descriptor)) {
    if(realmSchema[customField.name]===undefined) {
      realmSchema[customField.name] = getCompleteRealmType(customField);
    }
  }
  return realmSchema;
}

module.exports = {
  walkDescriptor: walkDescriptor,
  getCompleteRealmType: getCompleteRealmType,
  updateRealmSchema: updateRealmSchema
}