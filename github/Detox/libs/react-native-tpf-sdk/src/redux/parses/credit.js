export const loanCategoryParses = data => {
  if (data.length > 0) {
    return data.map(el => ({
      ...el,
      code: el?.id,
      displayName: el?.name
    }));
  }
  return [];
};
