
const userModel = {
  name: 'AuthInfo',
  primaryKey: 'id',
  properties: {
    id: 'string',
    email: 'string',
    emailValidated: {type: 'bool', default: false},
    emailToken:'string?',
    resetToken: 'string?',
    hasher:'string?',
    salt:'string?',
    password:'string',
    creationDate:'date',
    lastUpdatedDate:'date',
    accountType: 'string?',
    authToken: 'string?',
    activated: {type: 'bool', default: false},
    activationDate : 'date?',
    deactivationDate : 'date?'

  }
};

module.exports = [userModel];