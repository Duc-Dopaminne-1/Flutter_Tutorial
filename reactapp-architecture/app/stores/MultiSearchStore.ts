export enum MultiSearchStoreRef {
  TabView,
}

class MultiSearchStore {
  private _refs = new Map()

  setRef = (key, value) => {
    this._refs.set(key, value)
  }

  changeTabView = (index: number) => {
    const currentRef = this._refs.get(MultiSearchStoreRef.TabView)
    currentRef && currentRef.goToPage(index)
  }
}

export const multiSearchStore = new MultiSearchStore()
