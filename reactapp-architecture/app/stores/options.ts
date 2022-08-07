export interface SelectSub<T> {
  item: T
  index: number
}

export interface DeleteSub {
  index: number
}

export interface UpdateSub {
  selectedId: string
}
