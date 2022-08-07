import cloneDeep from 'lodash/cloneDeep';

const findPropertyTwoLevel = (data, id) =>
  data.reduce(
    (p, c, i) => {
      const j = data[i].properties.findIndex(x => x.propertyPostId === id);
      if (j > -1) {
        return [i, j];
      }
      return p;
    },
    {i: -1, j: -1},
  );

const hasArrayData = data => {
  if (data && Array.isArray(data) && data.length > 0) {
    return true;
  }

  return false;
};

const mapSelectedItemToArray = (list, selectedItem) => {
  const mapList = list?.map(e => {
    if (!selectedItem.id) {
      return {
        ...e,
        checked: e.id === list[0].id,
      };
    }
    return {
      ...e,
      checked: e.id === selectedItem.id,
    };
  });
  return mapList;
};

const sortArrayAlphabet = (array, property) => {
  if (array && Array.isArray(array) && array.length > 0) {
    const tempData = cloneDeep(array);

    const SortArray = (x, y) => {
      if (x[property] < y[property]) {
        return -1;
      }
      if (x[property] > y[property]) {
        return 1;
      }
      return 0;
    };
    const data = tempData?.sort(SortArray);
    return data;
  }
};

const ArrayUtils = {
  sortArrayAlphabet,
  findPropertyTwoLevel,
  hasArrayData,
  mapSelectedItemToArray,
};

export default ArrayUtils;
