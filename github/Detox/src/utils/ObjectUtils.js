export const updateObj = (object, path, newValue) => {
  if (path) {
    const valuePath = path.split('.'),
      last = valuePath.pop();
    let temp = object;

    for (let i = 0; i < valuePath.length; i++) {
      temp = temp[valuePath[i]];
    }
    temp[last] = newValue;
  }

  return deepCloneObject(object);
};

export const deepFindValue = (object, path) => {
  if (object && path) {
    const obj = {...object};
    const parts = path.split('.');
    if (parts.length === 1) {
      return obj[parts[0]];
    }
    return deepFindValue(obj[parts[0]], parts.slice(1).join('.'));
  }
};

export const deepCloneObject = obj => JSON.parse(JSON.stringify(obj));
