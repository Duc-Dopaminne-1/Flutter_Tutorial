export class CacheResult {
  static schema = {
    name: 'CacheResult',
    primaryKey: 'id',
    properties: {
      id: 'string',
      url: 'string',
      size: 'string',
      level: 'string?',
    },
  }
}
