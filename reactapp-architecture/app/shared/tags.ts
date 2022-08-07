import { differenceWith } from 'ramda'
import { Tag } from '@/models/team'

export class SafeTags {
  private _tag: Realm.Results<Tag> = null
  private _data: Realm.Results<Tag> = null

  constructor(tag: Realm.Results<Tag>) {
    this._tag = tag
    this._data = tag
  }

  set tag(tag: Realm.Results<Tag>) {
    this._tag = tag
  }

  set data(tag: Realm.Results<Tag>) {
    this._data = tag
  }

  get data() {
    return this._data
  }

  difference = (selectedTag: Tag[]) => {
    const cmp = (x, y) => x.id === y.id
    const newData = differenceWith<Tag, Tag>(cmp, this._tag, selectedTag)
    // @ts-ignore
    this._data = newData

    return newData as any
  }

  filter = (tag: Tag) => {
    const newData: any = this._data.filter(item => item.name !== tag.name)
    this._data = newData

    return newData
  }
}
