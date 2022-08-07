export const capitalize = (value: String) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const parseStringToJSON = (string: String) => {
  try {
    return !!string && JSON.parse(string);
  } catch (error) {
    return null;
  }
};
