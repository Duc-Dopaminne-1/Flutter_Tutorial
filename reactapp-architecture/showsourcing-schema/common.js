const withAudit = require('./utils/with-audit');


const common = {};

common.toRealmModel = function (models, withLinkingObjects, withObjectPermissions) {
  let result = [];
  for (name in models) {
    let model = Object.assign({}, models[name]);

    if (model.linkingObjects !== undefined) {
      let properties = Object.assign({}, model.properties);
      if (withLinkingObjects) {
        for (property in model.linkingObjects) {
          model.properties[property] = Object.assign({ type: "linkingObjects" }, model.linkingObjects[property]);
        }
      }
      model.properties = properties;
      delete model.linkingObjects;
    }

    if (model.haveObjectPermission) {
      if (withObjectPermissions) {
        let properties = Object.assign({}, model.properties);
        properties["permissions"] = '__Permission[]';
        model.properties = properties;
      }
      delete model.haveObjectPermission;
    }
    result.push(model);
  }
  return result;
};


common.teamModel = {
  name: 'Team',
  primaryKey: 'id',
  properties: {
    id: 'string',
    ownerUser: 'User',
    name: 'string',
    defaultCurrency: 'string?',
    status: { type: 'string', default: 'pending' },
    realmPath: 'string?',
    realmServerName: 'string?',
    creationDate: 'date',
    company: 'Company'
  },
  linkingObjects: {
    users: { objectType: 'TeamUser', property: 'team' }
  }
};

common.teamUserModel = {
  name: 'TeamUser',
  primaryKey: 'id',
  properties: {
    id: 'string',
    team: 'Team',
    user: 'User',
    accessType: 'string',
    status: { type: 'string', default: 'pending' }
  }
};

common.userModel = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    firstName: 'string',
    lastName: 'string',
    phoneNumber: 'string?',
    companyName: 'string?',
    email: 'string',
    currentTeam: 'Team',
    preferredLanguage: 'string?',
    avatar: 'Image?'
  },
  linkingObjects: {
    teams: { objectType: 'TeamUser', property: 'user' }
  }
};

common.userWithoutTeamModel = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    firstName: 'string?',
    lastName: 'string?',
    phoneNumber: 'string?',
    companyName: 'string?',
    email: 'string?',
    preferredLanguage: 'string?',
    avatar: 'Image?'
  }
};

common.eventDescriptionModel = {
  name: 'EventDescription',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    description: 'string?',
    website: 'string?',
    startDate: 'date?',
    endDate: 'date?',
    countryCode: 'string?',
    venue: 'Venue?',
    logoImage: 'Image?',
    global: { type: 'bool', default: false },
    supplierCount: { type: 'int', default: 0 },
    industry: 'Industry?',
    primaryColor: 'string?',
    secondaryColor: 'string?'
  },
  //haveObjectPermission: true
};

common.industryModel = {
  name: 'Industry',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string'
  }
};

common.immageUrlModel = {
  name: 'ImageUrl',
  primaryKey: 'id',
  properties: {
    id: 'string',
    maxWidth: 'int',
    maxHeight: 'int',
    url: 'string'
  },
  //haveObjectPermission: true
};

common.imageModel = {
  name: 'Image',
  primaryKey: 'id',
  properties: {
    id: 'string',
    fileName: 'string',
    orientation: 'int',
    imageType: 'string',
    data: 'data?',
    urls: 'ImageUrl[]'
  },
  //haveObjectPermission: true
};

common.invitationModel = {
  name: 'Invitation',
  primaryKey: 'id',
  properties: {
    id: 'string',
    email: 'string',
    inviterFirstName: 'string',
    inviterLastName: 'string',
    teamName: 'string',
    teamId: 'string',
    accessType: 'string',
    userId: 'string?',
    status: { type: 'string', default: 'pending' }
  }
};

common.payingSubscriptionModel = {
  name: 'PayingSubscription',
  primaryKey: 'id',
  properties: {
    id: 'string',
    nbUsers: 'int',
    validUntil: 'date',
    trialEnd: 'date?',
    status: 'string',
    accessRights: 'string'
  }
};

common.companyModel = {
  name: 'Company',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    owner: 'User',
    subscription: 'PayingSubscription?',
    description: 'string?',
    taxId: 'string?',
    industry: 'Industry[]',
    address: 'string?',
    phoneNumber: 'string?',
    website: 'string?',
    teams: 'Team[]',
    users: 'User[]'
  }
};

common.venueModel = {
  name: 'Venue',
  primaryKey: 'id',
  properties: {
    id: 'string',
    city: 'string?',
    name: 'string',
    latitude: 'double?',
    country: 'string?',
    longitude: 'double?',
    addressFull: 'string?'
  }
};


common.attachment = {
  name: 'Attachment',
  primaryKey: 'id',
  properties: {
    id: 'string',
    fileName: 'string',
    url: 'string?',
    size: 'double'
  }
};

common.AttachmentUploadRequest = {
  name: 'AttachmentUploadRequest',
  primaryKey: 'id',
  properties: {
    id: 'string',
    status: 'string',
    attachment: 'Attachment',
    uploadUrl: 'string?',
    formData: 'string?'
  }
};

common.imageUploadRequest = {
  name: 'ImageUploadRequest',
  primaryKey: 'id',
  properties: {
    id: 'string',
    status: 'string',
    image: 'Image',
    uploadUrl: 'string?',
    formData: 'string?'
  }
};

common.extendedField = {
  name: 'ExtendedField',
  primaryKey: 'id',
  properties: {
    id: 'string',
    definition: 'ExtendedFieldDefinition',
    value: 'string?'
  }
};

common.extendedFieldDefinition = {
  name: 'ExtendedFieldDefinition',
  primaryKey: 'id',
  properties: {
    id: 'string',
    label: 'string',
    type: 'string',
    order: 'int',
    target: 'string',
    metadata: 'string?',
  }
};

module.exports = common;
