export function checkModalProductInfo(key) {
  return [0, 1, 2, 3, 4, 7, 14, 17, 21, 24].indexOf(key) > -1
}

export function checkModalSupplierInfo(key) {
  return [0, 1, 6].indexOf(key) > -1
}

export function checkModalCreateProduct(key) {
  return [0, 1, 2, 3, 5, 9, 13, 16, 20, 23].indexOf(key) > -1
}

export function getCreateProductModalNumber(name: string) {
  switch (name) {
    case 'TextEditorModal':
      return 0
    case 'SelectMultiTag':
      return 3
    default:
      return 0
  }
}
