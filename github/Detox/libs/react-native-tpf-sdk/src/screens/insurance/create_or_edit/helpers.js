import __ from 'lodash';
export const findGroupFormByAttributeCode = (
  components = [],
  attributeCode = '',
  listAttributeKey = 'listAttribute'
) => {
  if (components?.length <= 0) {
    return {};
  }
  const result = __.find(components, o => {
    const tmp = __.find(o?.[listAttributeKey] || [], ob => ob?.attributeCode === attributeCode);
    if (tmp) {
      return true;
    }
    return false;
  });
  return result;
};

export const findIndexAttributeFromGroup = (
  groupForm = {},
  attributeCode = '',
  listAttributeKey = 'listAttribute'
) => {
  if (!groupForm) {
    return;
  }
  return __.findIndex(groupForm?.[listAttributeKey] || [], o => o?.attributeCode === attributeCode);
};

export const findAttributeFromGroup = (
  groupForm = {},
  attributeCode = '',
  listAttributeKey = 'listAttribute'
) => {
  if (!groupForm) {
    return {};
  }
  return __.find(groupForm?.[listAttributeKey] || [], o => o?.attributeCode === attributeCode);
};

export const findOptionDataFromAttribute = (attribute = {}) => {
  const tmp = attribute?.value;
  if (!attribute) {
    return;
  }
  return __.find(attribute?.optionData || [], o => o?.value?.toString() === tmp?.toString());
};
