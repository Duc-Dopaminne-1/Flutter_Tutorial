import { Category } from '@/models/team'
import { differenceWith } from 'ramda'

export class SafeCategories {
  private _categories: Realm.Collection<Category> = null
  private _data: Realm.Collection<Category> = null

  constructor(categories: Realm.Collection<Category>) {
    this._categories = categories
    this._data = categories
  }

  set categories(value: Realm.Collection<Category>) {
    this._categories = value
  }

  set data(value: Realm.Collection<Category>) {
    this._data = value
  }

  get category() {
    return this._categories
  }

  get data() {
    return this._data
  }

  difference = (selectedCategory: Realm.Collection<Category>) => {
    const cmp = (x, y) => x.id === y.id
    // @ts-ignore
    const newData = differenceWith<Category>(
      cmp,
      this._categories,
      selectedCategory
    )
    this._data = newData

    return newData
  }

  filter = (category: Category) => {
    const newData: any = this._data.filter(item => item.name !== category.name)
    this._data = newData

    return newData
  }
}
