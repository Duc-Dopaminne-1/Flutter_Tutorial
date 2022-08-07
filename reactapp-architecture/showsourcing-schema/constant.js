const constantSchema = [
  {
    name: 'Country',
    primaryKey: 'id',
    properties: {
      id: 'string',
      fullName: 'string',
      countryCode: 'string'
    }
  },
  {
    name: 'Currency',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      symbol: 'string'
    }
  },
  {
    name: 'Harbour',
    primaryKey: 'name',
    properties: {
      id: 'string',
      name: 'string'
    }
  },
  {
    name: 'Incoterm',
    primaryKey: 'name',
    properties: {
      id: 'string',
      name: 'string'
    }
  },
  {
    name: 'RealmServer',
    primaryKey: 'name',
    properties: {
      id: 'string',
      name: 'string',
      hostname: 'string',
      httpPort: 'int?',
      httpsPort: 'int?'
    }
  }
]; // constantSchema

module.exports = constantSchema;