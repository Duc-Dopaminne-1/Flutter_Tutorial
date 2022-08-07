// Type definitions for Fuse.js 3.2.0

declare module 'fuse.js' {
  export default class Fuse<T> {
    constructor(list: ReadonlyArray<T>, options?: Fuse.FuseOptions<T>)
    search(pattern: string): Fuse.FuseResult<T>[]

    setCollection(list: ReadonlyArray<T>): ReadonlyArray<T>
  }

  export interface FuseOptions<T> {
    id?: string
    caseSensitive?: boolean
    includeMatches?: boolean
    includeScore?: boolean
    shouldSort?: boolean
    sortFn?: (a: { score: number }, b: { score: number }) => number
    getFn?: (obj: any, path: string) => any
    keys?: (keyof T)[] | { name: keyof T; weight: number }[]
    verbose?: boolean
    tokenize?: boolean
    tokenSeparator?: RegExp
    matchAllTokens?: boolean
    location?: number
    distance?: number
    threshold?: number
    maxPatternLength?: number
    minMatchCharLength?: number
    findAllMatches?: boolean
  }

  export interface FuseResult<T> {
    item: T
    score: number
  }

  export interface SearchResult<T> {
    data: T[]
    isPerfect: boolean
  }
}
