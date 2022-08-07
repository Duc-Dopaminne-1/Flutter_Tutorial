/* eslint-disable no-unused-vars */
import ENV_KEYS from '../configs/envKeys';
import {encryptString} from './Encryption';

const Config = {
  //SHA256 key: SHA256 value T0penL@ndSecreteKey
  [ENV_KEYS.CONFIG_ENCRYPT_KEY]: 'c9e979dd4e39c2ab954773b18daea478a0abd4d193afd21786d9341da4e37aa2',

  [ENV_KEYS.OIDC_CLIENT_ID]: 'topenland-mobile',
  [ENV_KEYS.OIDC_CLIENT_SECRET]: 'T0penL@nd!@#',
  [ENV_KEYS.OIDC_BASE_URL]: 'https://id-uat-citus.topenland.com',

  [ENV_KEYS.GOOGLE_MAPS_API_KEY_ANDROID]: 'AIzaSyDVByvmq6kypcm6iw9vwL79uJkD5sT00cc',
  [ENV_KEYS.GOOGLE_MAPS_API_KEY_IOS]: 'AIzaSyDgqGAlo-Hm6i9VvpJp21QscareuuroJPY',
  [ENV_KEYS.GM_API_KEY_GEOCODING]: 'AIzaSyBMZRcCRx1AcqU2ZdMxFad2YfQZgS_S9Rg',

  [ENV_KEYS.REDUX_ENCRYPT_KEY]: '331ec8656bf1c0bbaf76c1dafda315f0f797ddc6e91dc0caa57aa8751f95a2c1',

  [ENV_KEYS.BASE_URL]: 'https://uat-citus.topenland.com',
  [ENV_KEYS.DEEP_LINKING_APP_SCHEME]: 'uatcitustopenland',
  [ENV_KEYS.DEEP_LINKING_WEB_SCHEME]: 'uat-citus.topenland.com',

  [ENV_KEYS.ONE_SIGNAL_APP_ID]: 'ddea6ff7-9b06-4a8c-8a0f-bfd9e5a5b08a',
  [ENV_KEYS.APPSFLYER_ID]: 'S7KVzMB8uDsu5faoDrfar7',
  [ENV_KEYS.SEGMENT_ID]: 'nrYvync3eH2kKvWk0aDucDiYVH2SE14H',
  [ENV_KEYS.RECAPTCHA_SITE_KEY]: '6LdCnsAdAAAAAMsiwr0sn9t99XS0H_2LNkXAh9OS',
};

const CONFIG_ENCRYPT_KEY = Config[ENV_KEYS.CONFIG_ENCRYPT_KEY];

// Encrypt auth
describe('Encryption test', () => {
  it('encrypt data uat-citus', () => {
    const envArray = [];
    envArray.push({[ENV_KEYS.CONFIG_ENCRYPT_KEY]: Config[ENV_KEYS.CONFIG_ENCRYPT_KEY]});

    envArray.push({
      [ENV_KEYS.OIDC_CLIENT_ID]: encryptString(Config[ENV_KEYS.OIDC_CLIENT_ID], CONFIG_ENCRYPT_KEY),
    });
    envArray.push({
      [ENV_KEYS.OIDC_CLIENT_SECRET]: encryptString(
        Config[ENV_KEYS.OIDC_CLIENT_SECRET],
        CONFIG_ENCRYPT_KEY,
      ),
    });
    envArray.push({
      [ENV_KEYS.OIDC_BASE_URL]: encryptString(Config[ENV_KEYS.OIDC_BASE_URL], CONFIG_ENCRYPT_KEY),
    });

    envArray.push({
      [ENV_KEYS.GOOGLE_MAPS_API_KEY_ANDROID]: Config[ENV_KEYS.GOOGLE_MAPS_API_KEY_ANDROID],
    });
    envArray.push({
      [ENV_KEYS.GOOGLE_MAPS_API_KEY_IOS]: Config[ENV_KEYS.GOOGLE_MAPS_API_KEY_IOS],
    });
    envArray.push({
      [ENV_KEYS.GM_API_KEY_GEOCODING]: encryptString(
        Config[ENV_KEYS.GM_API_KEY_GEOCODING],
        CONFIG_ENCRYPT_KEY,
      ),
    });

    envArray.push({
      [ENV_KEYS.REDUX_ENCRYPT_KEY]: encryptString(
        Config[ENV_KEYS.REDUX_ENCRYPT_KEY],
        CONFIG_ENCRYPT_KEY,
      ),
    });
    envArray.push({
      [ENV_KEYS.BASE_URL]: encryptString(Config[ENV_KEYS.BASE_URL], CONFIG_ENCRYPT_KEY),
    });

    envArray.push({
      [ENV_KEYS.DEEP_LINKING_APP_SCHEME]: encryptString(
        Config[ENV_KEYS.DEEP_LINKING_APP_SCHEME],
        CONFIG_ENCRYPT_KEY,
      ),
    });
    envArray.push({
      [ENV_KEYS.DEEP_LINKING_WEB_SCHEME]: encryptString(
        Config[ENV_KEYS.DEEP_LINKING_WEB_SCHEME],
        CONFIG_ENCRYPT_KEY,
      ),
    });
    envArray.push({
      [ENV_KEYS.ONE_SIGNAL_APP_ID]: encryptString(
        Config[ENV_KEYS.ONE_SIGNAL_APP_ID],
        CONFIG_ENCRYPT_KEY,
      ),
    });
    envArray.push({
      [ENV_KEYS.SEGMENT_ID]: encryptString(Config[ENV_KEYS.SEGMENT_ID], CONFIG_ENCRYPT_KEY),
    });
    envArray.push({
      [ENV_KEYS.APPSFLYER_ID]: encryptString(Config[ENV_KEYS.APPSFLYER_ID], CONFIG_ENCRYPT_KEY),
    });
    envArray.push({
      [ENV_KEYS.RECAPTCHA_SITE_KEY]: encryptString(
        Config[ENV_KEYS.RECAPTCHA_SITE_KEY],
        CONFIG_ENCRYPT_KEY,
      ),
    });

    let stringEnv = '';
    for (let index = 0; index < envArray.length; index++) {
      const elementEnv = envArray[index];

      for (const key in elementEnv) {
        if (elementEnv.hasOwnProperty(key)) {
          const elementValue = elementEnv[key];
          stringEnv += key + '=' + elementValue + '\n';
        }
      }
    }

    //console.log('stringEn: \n', stringEnv);
  });
});
