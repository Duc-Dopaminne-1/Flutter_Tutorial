/* DISCONTINUED!!!


 */




const common = require('./common');

const userModel = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    email: 'string',
    firstName: 'string',
    lastName: 'string',
    realmPath: 'string',
    realmServerName: 'string'
  },
  haveObjectPermission: true
};

module.exports = [ userModel, common.invitationModel ];
