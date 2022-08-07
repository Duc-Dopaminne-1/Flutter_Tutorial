const common = require('./common');

const supplierOnBoardingSchema = [
	common.attachment,
	common.AttachmentUploadRequest,
	{
    name: 'SupplierClaim',
    primaryKey: 'id',
    properties: {
      id: 'string',
			globalSupplierId: 'string?',
			name: 'string?',
			country: 'string?',
			street: 'string?',
			city: 'string?',
			zipCode: 'string?',
			businessType: 'string?',
			categories: 'string[]',
			description: 'string?',
			attachment: 'Attachment[]',
			qrCode: 'bool?',
			// contact info
			contactEmail: 'string?',
			contactPhone: 'string?',
			wechat: 'string?',
			whatsapp: 'string?',
			website: 'string?',
			// account
			accountEmail: 'string?',
			accountPhone: 'string?',
			password: 'string?',
			firstName: 'string?',
			lastName: 'string?'
		}
	}
];
module.exports = supplierOnBoardingSchema;