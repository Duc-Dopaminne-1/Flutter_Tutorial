export const convertToArrayObject = array =>
  array.map((item, index) => Object.assign({}, { id: index, answer: item }));

export const removeDuplicateObject = array =>
  array.reduce((acc, current) => {
    const x = acc.find(item => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
