const common = require('./common');
const withAudit = require('./utils/with-audit');

const globalRequestSchema = [
  common.attachment,
  common.AttachmentUploadRequest,
  withAudit(common.imageModel),
  common.immageUrlModel,
  common.imageUploadRequest,
  common.userWithoutTeamModel,
  {
    name: 'Request',
    primaryKey: 'id',
    haveObjectPermission: true,
    properties: {
      id: 'string',
      requestElements: 'RequestElement[]',
      sender: 'Contact',
      senderTeamId: 'string',
      templateName: 'string',
      createRequestId: 'string',
      title: 'string',
      message: 'string?', // additional message from sender
      recipient: 'Contact',
      recipientUser: 'User?',
      status: 'string',
      images: 'Image[]', // additional images
      attachments: 'Attachment[]', // additional attachments
      creationDate: 'date',
      lastUpdatedDate: 'date',
      sentDate: 'date'
    }
  },
  {
    name: 'RequestElement',
    primaryKey: 'id',
    haveObjectPermission: true,
    properties: {
      id: 'string',
      name: 'string',
      targetedEntityType: 'string',
      targetId: 'string',
      reply: 'RequestReply',
      images: 'Image[]',
      attachments: 'Attachment[]',
    }
  },
  {
    name: 'RequestReply',
    primaryKey: 'id',
    haveObjectPermission: true,
    properties: {
      id: 'string',
      message: 'string?',
      status: 'string',
      fields: 'ExtendedField[]',
      attachments: 'Attachment[]',
      images: 'Image[]'
    }
  },
  {
    name: 'Contact',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string?',
      // phoneNumber: 'string?',
      email: 'string?',
      // jobTitle: 'string?',
      company: 'string?'
    }
  },
  { ...common.extendedField, haveObjectPermission: true },
  {
    name: 'ExtendedFieldDefinition',
    primaryKey: 'id',
    properties: {
      id: 'string',
      label: 'string',
      type: 'string',
      order: 'int',
      target: 'string',
      metadata: 'string?',
      originId: 'string?', // added property that isn't on common.extendedFieldDefinition
    }
  }
];

module.exports = globalRequestSchema;