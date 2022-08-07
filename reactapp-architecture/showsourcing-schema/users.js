const common = require('./common');
const withAudit = require('./utils/with-audit');


const usersSchema = [
  common.teamModel,
  common.teamUserModel,
  common.userModel,
  common.companyModel,
  common.payingSubscriptionModel,
  common.industryModel,
  withAudit(common.imageModel),
  common.immageUrlModel,
  {
    name: 'Plan',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string'
    }
  },
  {
    name: 'Subscription',
    primaryKey: 'id',
    properties: {
      id: 'string',
      plan: 'Plan'
    }
  },

];


module.exports = usersSchema;