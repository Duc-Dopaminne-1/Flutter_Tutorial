const common = require('./common');
const withAudit = require('./utils/with-audit');

const userSchema = [
  common.teamModel,
  common.teamUserModel,
  common.AttachmentUploadRequest,
  common.attachment,
  withAudit(common.imageModel),
  common.immageUrlModel,
  {
    name: 'ImageUploadRequest',
    primaryKey: 'id',
    properties: {
      id: 'string',
      status: 'string',
      image: 'Image',
      uploadUrl: 'string?',
      formData: 'string?'
    }
  },
  common.userModel,
  {
    name: 'Company',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string'
    }
  },
  common.invitationModel
]; // userSchema

module.exports = userSchema;