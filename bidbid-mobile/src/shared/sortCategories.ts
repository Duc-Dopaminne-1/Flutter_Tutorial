const categoriesOrder = ['Career', 'Social', 'Dating'];

const sortCategories = categories =>
  categories && categories.length > 0
    ? categories.slice(0).sort(function (a, b) {
        return categoriesOrder.indexOf(a.name) - categoriesOrder.indexOf(b.name);
      })
    : [];

export default sortCategories;
