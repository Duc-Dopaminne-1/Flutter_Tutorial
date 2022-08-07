const sortAlphabet = (itemA, itemB) => {
  if (itemA.shortName.toLowerCase() < itemB.shortName.toLowerCase()) {
    return -1;
  }
  if (itemA.shortName.toLowerCase() > itemB.shortName.toLowerCase()) {
    return 1;
  }
  return 0;
};

export {sortAlphabet};
