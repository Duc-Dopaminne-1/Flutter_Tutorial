export const CacheImageSchema = {
  name: 'CacheImage',
  properties: {
    id: 'string',
    path: 'string',
  },
}

export interface CacheImage extends Realm.Object {
  id: string
  path: string
}
