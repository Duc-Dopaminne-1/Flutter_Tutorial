const updateSchema = require('./update-schema.utils');
const Schemas = require('../index');
const uuid = require('./uuid.utils');
const { waitForSubscription } = require('./realm.utils');

const schema = Schemas.withPermissions.teamSchema;
const host = 'showsourcingdev.us1a.cloud.realm.io';
const path = '/team/20b62de2-4caf-4aae-9ac0-3b683c3f0620';

const onCreateFn = realm => {
  return createInitialData(realm);
};

updateSchema(schema, host, path, onCreateFn).then(() => process.exit()).catch(() => process.exit());

const createInitialData = async realm => {
  await waitForSubscription(realm.objects('User'));
  return new Promise(resolve => {
    realm.write(() => {

      const extendedFieldDefinitions = [
        {
          id: uuid(),
          label: 'Price',
          type: 'price',
          target: 'product.price',
          order: 0,
        },
        {
          id: uuid(),
          label: 'Moq',
          type: 'int',
          target: 'product.minimumOrderQuantity',
          order: 1
        },
        {
          id: uuid(),
          label: 'Incoterm',
          type: 'selector',
          target: 'product.incoTerm',
          order: 2,
          metadata: JSON.stringify({ type: 'const', source: 'inco term', canCreate: false })
        },
        {
          id: uuid(),
          label: 'Harbour',
          type: 'selector',
          target: 'product.harbour',
          order: 3,
          metadata: JSON.stringify({ type: 'const', source: 'harbour', canCreate: false })
        },
      ];

      const requestTemplate = {
        id: uuid(),
        name: 'Quick RFQ',
        targetedEntity: 'Product',
        requestedFields: extendedFieldDefinitions
      };


      extendedFieldDefinitions.forEach(def => {
        realm.create('ExtendedFieldDefinition', def, true);
      });
      realm.create('RequestTemplate', requestTemplate, true);
      resolve(true);
    });
  });
};





