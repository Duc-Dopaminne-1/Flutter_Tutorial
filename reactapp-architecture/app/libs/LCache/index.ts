import { NativeModules, NativeEventEmitter } from 'react-native'

export type LCacheSource = { [key: string]: string }

export type LCacheSource2 = {
  id: string
  base64: string
}[]

export type CacheType = 'memory' | 'disk' | 'none'

export type Cache = { cached: boolean; cacheType: CacheType }

export type RetrieveImage = { isCached: boolean; path: string }

export type CameraData = {
  id: string
  base64: string
}

class LCache extends NativeEventEmitter {
  constructor(nativeModule) {
    super(nativeModule)

    this.prefetch = nativeModule.prefetch
    this.stopPrefetch = nativeModule.stopPrefetch
    this.store = (paths: string[]) => nativeModule.store(paths)
    this.storeWithoutSave = (paths: string[]) =>
      nativeModule.storeWithoutSave(paths)
    this.data = nativeModule.data
    this.data2 = nativeModule.data2
    this.clear = nativeModule.clear
    this.isCached = nativeModule.isCached
    this.retrieveImage = nativeModule.retrieveImage
    this.cleanCache = nativeModule.cleanCache
    this.data2 = nativeModule.data2
    this.storeAt = nativeModule.storeAt
    this.storeReplaceAt = nativeModule.storeReplaceAt
    this.rearrange = nativeModule.rearrange
    this.delete = nativeModule.delete
    this.retrieveArrayImage = nativeModule.retrieveArrayImage
  }

  static get default() {
    return lCache
  }

  prefetch: (paths: string[]) => Promise<string>
  stopPrefetch: (key: string) => void
  store: (paths: string[], size?: number) => Promise<CameraData[]>
  storeWithoutSave: (paths: string[]) => Promise<LCacheSource2>
  data: () => Promise<LCacheSource>
  data2: () => Promise<LCacheSource2>
  clear: () => Promise<Boolean> | void
  isCached: (key: string) => Promise<Cache>
  retrieveImage: (key: string) => Promise<RetrieveImage>
  cleanCache: () => any
  storeAt: (paths: string[], index: Number) => void
  storeReplaceAt: (paths: string[], index: Number) => void
  rearrange: (fromIndex: number, toIndex: number) => Promise<boolean> | void
  delete: (index: Number) => Promise<boolean> | void
  retrieveArrayImage: (listId: string[]) => Promise<LCacheSource2>
}

export const lCache = new LCache(NativeModules.RNLCache)
