const common = require('./common');

const globalSchema = [
  {
    name: 'Booth',
    primaryKey: 'id',
    properties: {
      id: 'string',
      supplier: 'Supplier',
      boothName: 'string'
    }
  },
  common.eventDescriptionModel,
  {
    name: 'Event',
    primaryKey: 'id',
    properties: {
      id: 'string',
      description: 'EventDescription',
      booths: 'Booth[]'
    }
  },
  common.industryModel,
  common.immageUrlModel,
  common.imageModel,
  {
    name: 'Supplier',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      supplierImage: 'Image?',
      countryCode: 'string?',
      addressFull: 'string?',
      website: 'string?',
      city: 'string',
      emailAddress: 'string?',
      phone: 'string?',
      description: 'string?',
      localName: 'string?',
      tradingName: 'string?',
      qrCode: 'string?',
      keywords: 'string?',
      additionalFields: 'string',
      type: 'string'
    }
  },
  common.venueModel,
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
  },
  {
    name: 'LengthUnit',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
    }
  },
  {
    name: 'WeightUnit',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
    }
  }

]; // globalSchema

module.exports = globalSchema;