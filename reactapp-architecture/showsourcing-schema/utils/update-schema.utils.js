const Realm = require('realm');
const { log, logError, logDebug } = require('./log.utils');

// Realm.Sync.enableSessionMultiplexing();
const config = require('showsourcing-config');
const TOKEN = config.getRequiredEnv('SHOWSOURCING_ROS_TOKEN');

/**
 * 
 * @param {any} schema correct schema we want to upload 
 * @param {string} host host without the protocol. Example: showsourcingdev.us1a.cloud.realm.io
 * @param {string} path path with the leading slash. Example: '/team/ababab' 
 * @param {Function} onCreateFn function that receive the realm as param to do stuff when the realm is created
 */
async function updateSchema(schema, host, path, onCreateFn = () => { }) {

  log('Starting');
  checkParams(host, path);
  const realmConfig = getRealmConfig(schema, host, path);
  const creds = Realm.Sync.Credentials.jwt(TOKEN);
  let realm;

  try {
    const adminUser = await Realm.Sync.User.login(`https://${host}`, creds);
    const config = adminUser.createConfiguration(realmConfig);
    realm = await Realm.open(config);
    log('New Schema Added, now uploading local changes...');
    await onCreateFn(realm);
    await realm.syncSession.uploadAllLocalChanges();
  } catch (err) {
    logError(err);
  } finally {
    log(realm ? 'closing realm' : 'not closing realm since it was not open');
    if (realm)
      realm.close();
  }
}

/** checks the validity of the params passed */
function checkParams(host, path) {
  logDebug('Checking parameters');

  if (host.startsWith('http://')
    || host.startsWith('realm://')
    || host.startsWith('https://')
    || host.startsWith('realms://')
  ) {
    throw Error('Host should not contain the protocol. Example: showsourcingdev.us1a.cloud.realm.io ');
  }
  if (!path.startsWith('/')) {
    throw Error('Path should start with a leading slash "/". Example /team/ababab');
  }
}

function getRealmConfig(schema, host, path) {
  logDebug('preparing realm config');

  return {
    sync: {
      url: `realms://${host}${path}`,
      error: err => logError(err, 'Connection Error')
    },
    schema
  };
}


module.exports = updateSchema;

