export type ImageLevel = 'low' | 'medium' | 'large'

export interface CacheResult extends Realm.Object {
  id: string
  url: string
  size: string
  level: ImageLevel
}
