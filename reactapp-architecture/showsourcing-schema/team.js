const common = require('./common');
const withAudit = require('./utils/with-audit');

const teamSchema = [
  common.teamModel,
  common.teamUserModel,
  common.userModel,
  common.AttachmentUploadRequest,
  common.attachment,
  withAudit({
    name: 'CreateRequest',
    primaryKey: 'id',
    properties: {
      id: 'string',
      products: 'Product[]',
      requestTemplate: 'RequestTemplate',
      shareInformation: 'bool',
      title: 'string',
      message: 'string?', // additional message from sender
      recipient: 'Contact',
      sendCopyTo: 'string[]',
      images: 'Image[]', // additional images
      attachments: 'Attachment[]' // additional attachments
    }
  }),
  {
    name: 'RequestTemplate',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      targetedEntity: 'string',
      requestedFields: 'ExtendedFieldDefinition[]'
    }
  },
  common.extendedField,
  common.extendedFieldDefinition,
  withAudit({
    name: 'Category',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
    }
  }),
  withAudit({
    name: 'Comment',
    primaryKey: 'id',
    properties: {
      id: 'string',
      text: 'string'
    }
  }),
  withAudit({
    name: 'Contact',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string?',
      phoneNumber: 'string?',
      email: 'string?',
      businessCardImage: 'Image?',
      jobTitle: 'string?',
      supplier: 'Supplier'
    }
  }),
  common.industryModel,
  common.eventDescriptionModel,
  withAudit({
    name: 'Event',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string?',
      rating: 'int?',

      description: 'EventDescription',
      comments: 'Comment[]'

    }
  }),
  common.immageUrlModel,
  withAudit(common.imageModel),
  common.imageUploadRequest,
  {
    name: 'Price',
    primaryKey: 'id',
    properties: {
      id: 'string',
      currency: 'string?',
      value: 'double?',
      baseCurrencyValue: 'double?'
    },
    //haveObjectPermission: true
  },
  {
    name: 'Packaging',
    primaryKey: 'id',
    properties: {
      id: 'string',
      height: 'double?',
      width: 'double?',
      length: 'double?',
      unit: 'string?',
      itemsQuantity: 'double?',
      weight: 'double?',
      weightUnit: 'string?'
    },
    //haveObjectPermission: true
  },
  {
    name: 'ProductStatus',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      inWorkflow: { type: 'bool', default: false },
      category: 'string',
      step: 'int?',
      final: { type: 'bool', default: false },
      deleted: { type: 'bool', default: false }
    }
  },
  {
    name: 'PriceMatrixRow',
    primaryKey: 'id',
    properties: {
      id: 'string',
      label: 'string?',
      price: 'Price?',
    },
    //haveObjectPermission: true
  },
  {
    name: 'PriceMatrix',
    primaryKey: 'id',
    properties: {
      id: 'string',
      rows: 'PriceMatrixRow[]'
    },
    //haveObjectPermission: true
  },
  withAudit({
    name: 'Product',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      supplier: 'Supplier?',
      images: 'Image[]',
      price: 'Price?',
      category: 'Category?',
      description: 'string?',
      event: 'Event?',
      favorite: 'bool?',
      status: 'ProductStatus?',

      assignee: 'User?',

      tags: 'Tag[]',

      minimumOrderQuantity: 'int?',
      moqDescription: 'string?',

      votes: 'ProductVote[]',
      score: 'int?',

      comments: 'Comment[]',
      attachments: 'Attachment[]',
      extendedFields: 'ExtendedField[]',
      // Trading Info --------
      incoTerm: 'string?',
      harbour: 'string?',
      masterCbm: 'double?',
      quantityPer20ft: 'int?',
      quantityPer40ft: 'int?',
      quantityPer40ftHC: 'int?',


      //Packaging
      innerCarton: 'Packaging?',
      masterCarton: 'Packaging?',

      // Price Matrix
      priceMatrix: 'PriceMatrix?',

      // Sample & Lead Time
      leadTimeValue: 'int?',
      leadTimeUnit: 'string?',
      sample: 'bool?',
      samplePrice: 'Price?',

      projects: 'Project[]',
      externalRequests: 'ExternalRequest[]',

      //Internals ---------
      archived: 'bool'

    },
    linkingObjects: {
      voteRequests: { objectType: 'ProductVoteRequest', property: 'product' }
    },
    //haveObjectPermission:true
  }),
  {
    name: 'ProductVote',
    primaryKey: 'id',
    properties: {
      id: 'string',
      user: 'User',
      value: 'int'
    },
    linkingObjects: {
      product: { objectType: 'Product', property: 'votes' }
    }
  },
  withAudit({
    name: 'ProductVoteRequest',
    primaryKey: 'id',
    properties: {
      id: 'string',
      product: 'Product',
      users: 'User[]',
      comment: 'string'
    }
  }),
  withAudit({
    name: 'Project',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      logoImage: 'Image?',
      description: 'string?'
    },
    linkingObjects: {
      products: { objectType: 'Product', property: 'projects' }
    }
  }),
  {
    name: 'SupplierType',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      deleted: { type: 'bool', default: false }
    }
  },
  withAudit({
    name: 'Sample',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      reference: 'string',
      status: 'SampleStatus',
      assignee: 'User',
      description: 'string',
      comments: 'Comment[]',
      product: 'Product',
      supplier: 'Supplier',
      images: 'Image[]',
      price: 'Price',
      paid: { type: 'bool', default: false }
    }
  }),
  {
    name: 'SampleStatus',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      inWorkflow: { type: 'bool', default: false },
      category: 'string',
      step: 'int?',
      final: { type: 'bool', default: false },
      deleted: { type: 'bool', default: false }
    }
  },
  {
    name: 'SupplierStatus',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      inWorkflow: { type: 'bool', default: false },
      category: 'string',
      step: 'int?',
      final: { type: 'bool', default: false },
      deleted: { type: 'bool', default: false }
    }
  },
  withAudit({
    name: 'Supplier',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      fullName: 'string?',
      tradingName: 'string?',

      status: 'SupplierStatus?',

      description: 'string?',
      images: 'Image[]',
      logoImage: 'Image?',
      supplierType: 'SupplierType?',
      website: 'string?',
      phoneNumber: 'string?',
      country: 'string?',
      city: 'string?',
      address: 'string?',
      officeEmail: 'string?',
      officePhone: 'string?',
      incoTerm: 'string?',
      harbour: 'string?',
      generalMOQ: 'int?',
      generalLeadTime: 'int?',

      tags: 'Tag[]',
      categories: 'Category[]',
      comments: 'Comment[]',
      attachments: 'Attachment[]',

      favorite: 'bool',

      globalDatabaseId: 'string?'
    },
    linkingObjects: {
      products: { objectType: 'Product', property: 'supplier' },
      contacts: { objectType: 'Contact', property: 'supplier' }
    }
  }),
  withAudit({
    name: 'Tag',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string'
    }
  }),
  {
    name: 'TaskType',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      deleted: { type: 'bool', default: false }
    }
  },
  withAudit({
    name: 'Task',
    primaryKey: 'id',
    properties: {
      id: 'string',
      type: 'TaskType',
      name: 'string?',
      code: 'string?',
      description: 'string?',

      done: 'bool?',
      dueDate: 'date?',
      completionDate: 'date?',
      assignee: 'User?',
      comments: 'Comment[]',
      product: 'Product?',
      supplier: 'Supplier?'
    }
  }),
  common.venueModel,
  {
    name: 'Invitation',
    primaryKey: 'id',
    properties: {
      id: 'string',
      email: 'string',
      inviter: 'User',
      accessType: 'string',
      status: { type: 'string', default: 'pending' }
    }
  },
  {
    name: 'CustomSchemaRequest',
    primaryKey: 'id',
    properties: {
      id: 'string', // Valid values: product, supplier
      uiDescriptor: 'string',
      status: { type: 'string', default: 'edit' }, // Values: edit, valid, invalid, submit, applied
      errors: 'string[]'
    }
  },
  common.payingSubscriptionModel,
  common.companyModel,
  {
    name: 'Role',
    primaryKey: 'name',
    properties: {
      name: 'string',
      access: 'string',
      premiumRequired: 'bool'
    }
  },
  {
    name: 'ExportRequest',
    primaryKey: 'id',
    properties: {
      id: 'string',
      format: 'string',
      type: 'string',
      query: 'string?', // JSON description of the query parameters
      status: { type: 'string', default: 'created' }, // Values: created, rejected, processing, ready
      documentUrl: 'string?',
      errors: 'string[]',
      creationDate: 'date',
      createdBy: 'User'
    }
  },
  withAudit({
    name: 'ExternalRequest',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      description: 'string?',
      companyName: 'string?',
      quotes: 'Quote[]',
      descriptor: 'string',
      targetedMOQ: 'int?',
      status: 'string', // possible values: pending, replied, busy, resent, declined, validated
      supplier: 'Supplier',
      images: 'Image[]',
      event: 'EventDescription',
      recipients: 'string[]'
    },
    linkingObjects: {
      product: { objectType: 'Product', property: 'externalRequests' }
    },
    //haveObjectPermission: true
  }),
  {
    name: 'Quote',
    primaryKey: 'id',
    properties: {
      id: 'string',
      status: 'string', // possible values: pending, done, declined
      comment: 'string?',

      // Basic product fields
      name: 'string',
      price: 'Price?',
      description: 'string?',
      minimumOrderQuantity: 'int?',
      moqDescription: 'string?',
      innerCarton: 'Packaging?',
      masterCarton: 'Packaging?',
      priceMatrix: 'PriceMatrix?',
      leadTimeValue: 'int?',
      leadTimeUnit: 'string?',
      sample: 'bool?',
      samplePrice: 'int?'
    },
    //haveObjectPermission: true
  }
]; // TeamSchema

module.exports = teamSchema;
