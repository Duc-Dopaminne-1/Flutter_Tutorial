import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';

const stringifyJSONObject = (jsonObject = {}) => {
  return JSON.stringify(jsonObject);
};

const stringifyJSONArray = (jsonArray = []) => {
  return JSON.stringify(jsonArray);
};

const parseJSONArray = json => {
  if (!json) {
    return [];
  }
  const list = JSON.parse(json);
  if (!Array.isArray(list)) {
    return [];
  }
  return list;
};

const parseJSONObject = json => {
  return json ? JSON.parse(json) : {};
};

const deleteEmptyDataFiled = data => {
  return omitBy(data, isNil);
};

export default {
  stringifyJSONObject,
  deleteEmptyDataFiled,
  stringifyJSONArray,
  parseJSONArray,
  parseJSONObject,
};
