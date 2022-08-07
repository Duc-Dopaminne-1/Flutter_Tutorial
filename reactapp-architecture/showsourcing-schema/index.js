const common = require('./common');
const defaults = require('./defaults');
const helpers = require('./helpers');

/**
 *
 * @param {Array<{name:string}>} schema
 */
function fixSchema(schema) {
  let fixedSchema = [];
  let hasUser = false;

  let hasSysRole = false;
  let hasRole = false;

  for (let item of schema) {
    switch (item.name) {
      case 'User':
        fixedSchema.push(item);
        hasUser = true;
        break;
      case '__User':
        // Nothing to do
        break;
      case 'Role':
        fixedSchema.push(item);
        hasRole = true;
        break;
      case '__Role':
        hasSysRole = true;
        break;
      default:
        fixedSchema.push(item);
    }
  }

  if (hasRole && !hasSysRole) {
    fixedSchema.push(Realm.Permissions.Role.schema);
  }

  if (hasUser) {
    fixedSchema.push(Realm.Permissions.User.schema);
  }

  return fixedSchema;
}

function withSysPermissions(schema) {
  const map = new Map();
  for (const k of schema) {
    map.set(k.name, true);
  }

  if (!map.has('__Permission')) {
    schema.push({
      name: '__Permission',
      properties: {
        role: '__Role',
        canRead: 'bool',
        canUpdate: 'bool',
        canDelete: 'bool',
        canSetPermissions: 'bool',
        canQuery: 'bool',
        canCreate: 'bool',
        canModifySchema: 'bool'
      }
    }
    );
  }

  if (!map.has('__Realm')) {
    schema.push({
      name: '__Realm',
      primaryKey: 'id',
      properties: {
        id: 'int',
        permissions: '__Permission[]'
      }
    });
  }

  if (!map.has('__Role')) {
    schema.push({
      name: '__Role',
      primaryKey: 'name',
      properties: {
        name: 'string',
        members: '__User[]'
      }
    });
  }

  if (!map.has('__User')) {
    schema.push({
      name: '__User',
      primaryKey: 'id',
      properties: {
        id: 'string',
        role: '__Role'
      }
    });
  }


  return schema;
}


module.exports = {
  auth: common.toRealmModel(require("./auth"), true, false),
  teamSchema: common.toRealmModel(require("./team"), true, false),
  userSchema: common.toRealmModel(require("./user"), true, false),
  allUserSchema: common.toRealmModel(require("./all-users"), true, false),
  constantSchema: common.toRealmModel(require("./constant"), true, false),
  globalSchema: common.toRealmModel(require("./global"), true, false),
  companySchema: common.toRealmModel(require("./company"), true, false),
  supplierOnboardingSchema: common.toRealmModel(require("./supplier-onboarding"), true, false),
  uiDescriptor: require("./ui-descriptor"),
  withoutLinkingObjects: {
    userSchema: common.toRealmModel(require("./user"), false, false),
    teamSchema: common.toRealmModel(require("./team"), false, false),
    allUserSchema: common.toRealmModel(require("./all-users"), false, false),
    constantSchema: common.toRealmModel(require("./constant"), false, false),
    globalSchema: common.toRealmModel(require("./global"), false, false),
    companySchema: common.toRealmModel(require("./company"), false, false),
    supplierOnboardingSchema: common.toRealmModel(require("./supplier-onboarding"), false, false),
  },
  withPermissions: {
    teamSchema: common.toRealmModel(require("./team"), true, true),
    allUserSchema: common.toRealmModel(require("./all-users"), true, true),
    usersSchema: common.toRealmModel(require("./users"), false, true),
    globalRequestSchema: common.toRealmModel(require("./global-request"), true, true),
    globalSchema: common.toRealmModel(require("./global"), true, true),
  },
  invitationsSchema: common.toRealmModel([common.invitationModel], true, false),
  withCustomFields: helpers.withCustomFields,
  defaults: defaults,
  fixSchema: fixSchema,
  withSysPermissions: withSysPermissions
};
