import Fuse, { FuseOptions, FuseResult, SearchResult } from 'fuse.js'
import { isNil } from 'ramda'

export class FuseService<T> {
  private _fuse: Fuse<T>
  private _data: Realm.Collection<T>
  private readonly _options: FuseOptions<T> = {
    keys: [
      'name',
      // 'description',
      // 'supplier.name',
      // 'category.name',
      // 'tags.name',
    ] as any,
    shouldSort: true,
    includeScore: true,
    threshold: 0.1,
    location: 0,
    distance: 1000,
    minMatchCharLength: 1,
    maxPatternLength: 100,
  }

  constructor(data: Realm.Collection<T>, options?: FuseOptions<T>) {
    this._data = data
    if (isNil(options)) {
      this._options = Object.assign<
        FuseOptions<T>,
        FuseOptions<T>,
        FuseOptions<T>
      >({}, this._options, options)
    } else {
      this._options = {
        shouldSort: true,
        includeScore: true,
        threshold: 0.1,
        location: 0,
        distance: 1000,
        minMatchCharLength: 1,
        maxPatternLength: 100,
        ...options,
      }
    }

    this._fuse = new Fuse(this._data, this._options)
  }

  get data() {
    return this._data
  }

  update = (data: Realm.Collection<T>) => {
    this._fuse = new Fuse(data, this._options)
    this._data = data
  }

  get instance() {
    return this._fuse
  }

  search = (keyword: string): SearchResult<T> => {
    if (!this._fuse) {
      return null
    }

    const data = this._fuse.search(keyword)
    return {
      data: this.convert(data),
      isPerfect: this.isPerfect(data),
    }
  }

  convert = (data: FuseResult<T>[]): T[] => {
    return data.map(el => el.item)
  }

  isPerfect = (data: FuseResult<T>[]): boolean => {
    return data.length > 0 && data[0].score === 0
  }
}
