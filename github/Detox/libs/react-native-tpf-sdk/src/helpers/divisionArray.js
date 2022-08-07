export const divisionArray = (arr, len) => {
  const result = [];
  let i = 0;
  let n = arr.length;
  while (i < n) {
    result.push(arr.slice(i, (i += len)));
  }
  return result;
};
