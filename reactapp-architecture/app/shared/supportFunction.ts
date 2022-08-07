import { differenceWith } from 'ramda'

export function difference(selectData: any, mainData: any) {
  const cmp = (x, y) => x.id === y.id

  return differenceWith<any, any>(cmp, mainData, selectData)
}
