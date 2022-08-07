export class Paging<T extends { id: string }> {
  private _source: Realm.Collection<T> = [] as any
  private _total: number = 0

  public static readonly LIMIT = 10

  constructor(source?: Realm.Collection<T>) {
    this._source = source
  }

  get latestItem(): T {
    if (this._source && this._source[this._source.length - 1]) {
      return this._source[this._source.length - 1]
    }

    return { id: '' } as T
  }

  get data(): Realm.Collection<T> {
    return this.next(null, this._total)
  }

  update(source: Realm.Collection<T>) {
    this._source = source
  }

  currentIndex(after?: string): number {
    if (!after) return 0

    const current = this._source.findIndex(value => {
      return value.id === after
    })

    return current + 1
  }

  isEnd(currentId: string) {
    return currentId === (this.latestItem.id || '')
  }

  getLatestId(source: Realm.Collection<T> = [] as any): string {
    const item = source[source.length - 1]
    return item && item.id
  }

  next(after?: string, limit = Paging.LIMIT): Realm.Collection<T> {
    this._total = this._total + limit
    const currentIndex = this.currentIndex(after)

    return this._source
      ? (this._source.slice(currentIndex, currentIndex + limit) as any)
      : []
  }

  getDataFromStart(
    currentRenderIndex?: number,
    limit: number = Paging.LIMIT
  ): Realm.Collection<T> {
    // const currentIndex = this.currentIndex(after)

    if (currentRenderIndex === 0) {
      return this._source
        ? (this._source.slice(
            currentRenderIndex,
            currentRenderIndex + limit
          ) as any)
        : []
    }

    return this._source
      ? (this._source.slice(0, currentRenderIndex) as any)
      : []
  }
}
