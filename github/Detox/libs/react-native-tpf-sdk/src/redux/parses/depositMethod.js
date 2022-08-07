export const depositMethodParse = data => {
  if (data.length > 0) {
    return data.map(el => ({
      id: el?.Id,
      value: el?.Code,
      title: el?.DisplayName,
      checked: el?.Checked
    }));
  }
  return [];
};
