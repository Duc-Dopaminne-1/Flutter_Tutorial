/* eslint-disable sonarjs/no-duplicate-string */
import Config from 'react-native-config';

import {decryptString} from '../utils/Encryption';
import ENV_KEYS from './envKeys';

const CONFIG_ENCRYPT_KEY = Config[ENV_KEYS.CONFIG_ENCRYPT_KEY];
const BASE_URL = decryptString(Config[ENV_KEYS.BASE_URL], CONFIG_ENCRYPT_KEY);
const REDUX_ENCRYPT_KEY = decryptString(
  Config[ENV_KEYS.REDUX_ENCRYPT_KEY],
  CONFIG_ENCRYPT_KEY,
);
const OIDC_BASE_URL = decryptString(
  Config[ENV_KEYS.OIDC_BASE_URL],
  CONFIG_ENCRYPT_KEY,
);
const OIDC_CLIENT_ID = decryptString(
  Config[ENV_KEYS.OIDC_CLIENT_ID],
  CONFIG_ENCRYPT_KEY,
);
const OIDC_CLIENT_SECRET = decryptString(
  Config[ENV_KEYS.OIDC_CLIENT_SECRET],
  CONFIG_ENCRYPT_KEY,
);
const GM_API_KEY_GEOCODING = decryptString(
  Config[ENV_KEYS.GM_API_KEY_GEOCODING],
  CONFIG_ENCRYPT_KEY,
);
const DEEP_LINKING_APP_SCHEME = decryptString(
  Config[ENV_KEYS.DEEP_LINKING_APP_SCHEME],
  CONFIG_ENCRYPT_KEY,
);
const DEEP_LINKING_WEB_SCHEME = decryptString(
  Config[ENV_KEYS.DEEP_LINKING_WEB_SCHEME],
  CONFIG_ENCRYPT_KEY,
);
const ONE_SIGNAL_APP_ID = decryptString(
  Config[ENV_KEYS.ONE_SIGNAL_APP_ID],
  CONFIG_ENCRYPT_KEY,
);
const APPSFLYER_ID = decryptString(
  Config[ENV_KEYS.APPSFLYER_ID],
  CONFIG_ENCRYPT_KEY,
);
const SEGMENT_ID = decryptString(
  Config[ENV_KEYS.SEGMENT_ID],
  CONFIG_ENCRYPT_KEY,
);
const RECAPTCHA_SITE_KEY = decryptString(
  Config[ENV_KEYS.RECAPTCHA_SITE_KEY],
  CONFIG_ENCRYPT_KEY,
);

const Configs = {
  graphql: {
    GRAPHQL_URL: BASE_URL + '/gateway/graphql',
  },
  auth: {
    AUTH_URL: OIDC_BASE_URL + '/account',
  },
  rest: {
    BASE_URL: BASE_URL + '/gateway',
  },
  static_rules: {
    BASE_URL: BASE_URL,
  },
  redux: {
    REDUX_ENCRYPT_KEY: REDUX_ENCRYPT_KEY,
  },
  onboardingVersion: '6',
  oidc: {
    OIDC_CLIENT_ID: OIDC_CLIENT_ID,
    OIDC_CLIENT_SECRET: OIDC_CLIENT_SECRET,
    OIDC_SERVICE_TOKEN_ENDPOINT: OIDC_BASE_URL + '/connect/token',
    OIDC_SERVICE_REVOCATION_ENDPOINT: OIDC_BASE_URL + '/connect/revocation',
  },
  portal: {
    PORTAL_URL: BASE_URL,
  },
  googleMap: {
    API_URL: 'https://maps.googleapis.com/maps/api',
    API_KEY_GEOCODING: GM_API_KEY_GEOCODING,
  },
  deepLinking: {
    DEEP_LINKING_APP_SCHEME: DEEP_LINKING_APP_SCHEME,
    DEEP_LINKING_WEB_SCHEME: DEEP_LINKING_WEB_SCHEME,
  },
  oneSignal: {
    ONE_SIGNAL_APP_ID: ONE_SIGNAL_APP_ID,
  },
  config: {
    CONFIG_ENCRYPT_KEY: CONFIG_ENCRYPT_KEY,
  },
  stringee: {
    IS_CLOUD: false,
    CHAT_WIDGET_CLOUD: 'anZPaXczajBQenJ1RkxZTHNJUUtVUT09',
  },
  appsflyer: {
    APPSFLYER_ID: APPSFLYER_ID,
  },
  appleStoreId: '1519958621',
  segment: {
    SEGMENT_ID: SEGMENT_ID,
  },
  recaptcha: {
    RECAPTCHA_SITE_KEY: RECAPTCHA_SITE_KEY,
  },
  tpm: {
    getURL: token =>
      `https://topenmap:hN21T5br@map.datafirst.vn/iframe/${token}?target=search-landplot&isIframe=true`,
  },
  depositContactTradingTemplate:
    'https://perstoresb.blob.core.windows.net/template/HopDongDatCoc_Kytay.docx',
  createPropertyPostC2CTemplate:
    'https://prodstore01.blob.core.windows.net/public/Thoa_Thuan_Dang_Tin.pdf',
  imagePanoramaUrl: `${BASE_URL}/post/public/panorama-review-frame`,
  imagePanoramaUpdateUrl: `${BASE_URL}/post/public/panorama-form-frame`,
  valuationUrl: `${BASE_URL}/dinh-gia/valuation-iframe`,
  valuationGettokenUrl: 'https://re-evaluation.datafirst.vn',
};

export const getConfigs = (envName = Config.CUSTOM_APP_SCHEME) => {
  const COOKIE =
    'j2sgd2dwaqzm6t8b=true;TOPENLAND_HOME_BANNER=TOPENLAND_HOME_BANNER';
  let configs = {
    COOKIE,
    tpf: {
      PORTAL: 'https://tpf-sandbox.topenland.com',
    },
    tpfSDK: {
      remoteAddress: 'https://htf-sdk-tpl-integration-uat.topenfintech.com/',
      appId:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTW9iaWxlLVNkayIsImlhdCI6MTUxNjIzOTAyMn0.1O9ZQYhtyw40zeSYjaSrGzMJl4BrMqrXcAl96xbvILs',
    },
    stringee: {
      SERVER: {
        V1: 'call-v1.topenland.com',
        V2: 'call-v2.topenland.com',
        PORT: 9879,
      },
      PORTAL: 'https://call-dev-portal.topenland.com',
      CHAT_WIDGET: 'L2EzREIwYjJUbjIrY1k5R0QwZ0RSQT09',
      HOTLINE_NUMBER: '842873098869',
    },
    recaptcha: {
      RECAPTCHA_SITE_KEY: '6LfjBKweAAAAANZerXmnlDpVWH1VYpK0XmjQZF2I',
    },
    segment: {
      key: '9eU0luV6xaXOG57bELxdEa7PkG0jbKh8',
    },
    appsflyer: {
      key: '',
    },
  };
  switch (envName) {
    case 'qacitustopenland':
      configs = {
        COOKIE,
        tpf: {
          PORTAL: 'https://tpf-qa.topenland.com',
        },
        tpfSDK: {
          remoteAddress:
            'https://htf-sdk-tpl-integration-uat.topenfintech.com/',
          appId:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTW9iaWxlLVNkayIsImlhdCI6MTUxNjIzOTAyMn0.1O9ZQYhtyw40zeSYjaSrGzMJl4BrMqrXcAl96xbvILs',
        },
        stringee: {
          SERVER: {
            V1: 'call-v1.topenland.com',
            V2: 'call-v2.topenland.com',
            PORT: 9879,
          },
          PORTAL: 'https://call-qa-portal.topenland.com',
          CHAT_WIDGET: 'S1NVVTZrYk5GZlRPNUFxdEh5WEpFQT09',
          HOTLINE_NUMBER: '842873058869',
        },
        recaptcha: {
          RECAPTCHA_SITE_KEY: '6LfjBKweAAAAANZerXmnlDpVWH1VYpK0XmjQZF2I',
        },
        segment: {
          key: '',
        },
        appsflyer: {
          key: '',
        },
      };
      break;
    case 'uatcitustopenland':
    case 'stgtopenland':
      configs = {
        COOKIE,
        tpf: {
          PORTAL: 'https://tpf-uat.topenland.com',
        },
        tpfSDK: {
          remoteAddress:
            'https://htf-sdk-tpl-integration-uat.topenfintech.com/',
          appId:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTW9iaWxlLVNkayIsImlhdCI6MTUxNjIzOTAyMn0.1O9ZQYhtyw40zeSYjaSrGzMJl4BrMqrXcAl96xbvILs',
        },
        stringee: {
          SERVER: {
            V1: 'call-v1.topenland.com',
            V2: 'call-v2.topenland.com',
            PORT: 9879,
          },
          PORTAL: 'https://call-uat-portal.topenland.com',
          CHAT_WIDGET: 'ODRZUEUxTUtUZmt3Uzk3THdWSWJvQT09',
          HOTLINE_NUMBER: '842873078869',
        },
        recaptcha: {
          RECAPTCHA_SITE_KEY: '6LfjBKweAAAAANZerXmnlDpVWH1VYpK0XmjQZF2I',
        },
        segment: {
          key: 'nrYvync3eH2kKvWk0aDucDiYVH2SE14H',
        },
        appsflyer: {
          key: '',
        },
      };
      break;
    case 'topenland':
      configs = {
        COOKIE:
          'bZgt2vdV66m1gPY3=true;TOPENLAND_HOME_BANNER=TOPENLAND_HOME_BANNER',
        tpf: {
          PORTAL: 'https://tpf.topenland.com',
        },
        tpfSDK: {
          remoteAddress: 'https://htf-sdk-tpl-integration.topenfintech.com/',
          appId:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTW9iaWxlLVNkayIsImlhdCI6MTUxNjIzOTAyMn0.ss88AYFnenejca8JgO-Q4OlFG70rFNe3PWaWhZ4PY4Q',
        },
        stringee: {
          SERVER: {
            V1: 'stringee-v1.topenland.com',
            V2: 'stringee-v2.topenland.com',
            PORT: 9879,
          },
          PORTAL: 'https://contactcenter.topenland.com',
          CHAT_WIDGET: 'OWVjVmdWVDJFM2N1eGJ2eTIrelErZz09',
          // HOTLINE_NUMBER: '842873018869',
          HOTLINE_NUMBER: '19008000',
        },
        recaptcha: {
          RECAPTCHA_SITE_KEY: '6LfMygwfAAAAAN-1v6Oyqgw3zIAT3rk4xvOaF_rR',
        },
        segment: {
          key: 'ucSTudLGTP7jy7Z2ZKfOfyQKTLa4P1S6',
        },
        appsflyer: {
          key: 'S7KVzMB8uDsu5faoDrfar7',
        },
      };
      break;
    default:
      break;
  }
  return configs;
};

export default Configs;
