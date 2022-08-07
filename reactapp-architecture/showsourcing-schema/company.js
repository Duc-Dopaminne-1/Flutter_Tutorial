const common = require('./common');
const withAudit = require('./utils/with-audit');

const companySchema = [
  common.companyModel,
  common.teamModel,
  common.userModel,
  withAudit(common.imageModel),
  common.immageUrlModel,
  common.teamUserModel,
  common.industryModel,
  common.payingSubscriptionModel,
  {
    name: 'CompanyUser',
    primaryKey: 'id',
    properties: {
      id: 'string',
      company: 'Company',
      user: 'User',
      premium: 'bool'
    }
  },
  {
    name: 'PaymentRequest',
    primaryKey: 'id',
    properties: {
      id: 'string',
      nbUsers: 'int',
      status: 'string',
      subscription: 'PayingSubscription?',
      coupon: 'string?',
      plan: 'string?',
      price: 'int?',
      paymentToken: 'string?'
    }
  }
];

module.exports = companySchema;
