

const updateSchema = require('./update-schema.utils');
const Schemas = require('../index');

const schema = Schemas.withPermissions.globalRequestSchema;
const host = 'showsourcingprod.us1.cloud.realm.io';
const path = '/global-request';
const { ensurePermission, Permissions, ensureRole } = require('showsourcing-permissions');


const onCreateFn = realm => {
  setDefaultACL(realm);
};


const setDefaultACL = async realm => {

  realm.write(() => {

    // Realm Level ACL
    const everyoneRole = ensureRole(realm, 'everyone');
    const everyoneRUQCPermission = ensurePermission(realm, everyoneRole, Permissions.ruqc, Permissions.ruqc_q);

    let realmPermissions = realm.permissions().permissions;

    realmPermissions = [];
    realmPermissions.push(everyoneRUQCPermission);

    const everyonePermissions = {
      rq: ensurePermission(realm, everyoneRole, Permissions.rq, Permissions.rq_q),
      ruqc: ensurePermission(realm, everyoneRole, Permissions.ruqc, Permissions.ruqc_q),
      ruq: ensurePermission(realm, everyoneRole, Permissions.ruq, Permissions.ruq_q),
      ruc: ensurePermission(realm, everyoneRole, Permissions.ruc, Permissions.ruc_q),
      ru: ensurePermission(realm, everyoneRole, Permissions.ru, Permissions.ru_q),
      rqc: ensurePermission(realm, everyoneRole, Permissions.rqc, Permissions.rqc_q),
      rc: ensurePermission(realm, everyoneRole, Permissions.rc, Permissions.rc_q),
      r: ensurePermission(realm, everyoneRole, Permissions.r, Permissions.r_q),
      none: ensurePermission(realm, everyoneRole, Permissions.none, Permissions.none_q)
    };

    const everyonePermissionsMap = new Map();
    everyonePermissionsMap.set('Attachment', everyonePermissions.rc);
    everyonePermissionsMap.set('AttachmentUploadRequest', everyonePermissions.ruqc);
    everyonePermissionsMap.set('Request', everyonePermissions.rq);
    everyonePermissionsMap.set('RequestElement', everyonePermissions.rq);
    everyonePermissionsMap.set('RequestReply', everyonePermissions.ru);
    everyonePermissionsMap.set('Image', everyonePermissions.rc);
    everyonePermissionsMap.set('ImageUploadRequest', everyonePermissions.ruqc);
    everyonePermissionsMap.set('Contact', everyonePermissions.r);
    everyonePermissionsMap.set('ExtendedField', everyonePermissions.ru);
    everyonePermissionsMap.set('ExtendedFieldDefinition', everyonePermissions.r);
    everyonePermissionsMap.set('ImageUrl', everyonePermissions.r);
    everyonePermissionsMap.set('User', everyonePermissions.r);

    for (let classObj of realm.objects('__Class')) {
      classObj.permissions = [];
      if (everyonePermissionsMap.has(classObj.name)) {
        classObj.permissions.push(everyonePermissionsMap.get(classObj.name));
      }
    }
  });


};

updateSchema(schema, host, path, onCreateFn).then(() => process.exit()).catch(() => process.exit());
