

const updateSchema = require('./update-schema.utils');
const Schemas = require('../index');

const schema = Schemas.withPermissions.globalSchema;
const host = 'showsourcingdev.us1a.cloud.realm.io';
const path = '/global/global-data';
const { ensurePermission, Permissions, ensureRole } = require('showsourcing-permissions');
const uuid = require('utils/uuid.utils');

const lengthUnits = [
  { id: uuid(), name: 'mm' },
  { id: uuid(), name: 'cm' },
  { id: uuid(), name: 'm' },
  { id: uuid(), name: 'ft' },
  { id: uuid(), name: 'in' }
];

const weightUnits = [
  { id: uuid(), name: 'g' },
  { id: uuid(), name: 'kg' },
  { id: uuid(), name: 'oz' },
  { id: uuid(), name: 'lb' },
];

const onCreateFn = async realm => {
  createUnits(realm);
  setDefaultACL(realm);
};


const createUnits = async realm => {
  realm.write(() => {
    weightUnits.forEach(wu => realm.create('WeightUnit', wu));
    lengthUnits.forEach(lu => realm.create('LengthUnit', lu));
  });
};

const setDefaultACL = async realm => {
  realm.write(() => {
    // Realm Level ACL
    const everyoneRole = ensureRole(realm, 'everyone');
    const everyonePermissions = {
      rq: ensurePermission(realm, everyoneRole, Permissions.rq, Permissions.rq_q)
    };

    // adding read only perms
    const everyonePermissionsMap = new Map();
    everyonePermissionsMap.set('WeightUnit', everyonePermissions.rq);
    everyonePermissionsMap.set('LengthUnit', everyonePermissions.rq);

    for (let classObj of realm.objects('__Class')) {
      if (everyonePermissionsMap.has(classObj.name)) {
        classObj.permissions = [];
        classObj.permissions.push(everyonePermissions.rq);
      }
    }
  });
};

updateSchema(schema, host, path, onCreateFn).then(() => process.exit()).catch(() => process.exit());
