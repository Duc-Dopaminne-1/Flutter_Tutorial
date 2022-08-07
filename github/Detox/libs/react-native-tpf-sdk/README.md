# react-native-tpf-sdk

## Getting started

### Installation

With npm:

`$ npm install --save react-native-tpf-sdk`

With yarn:

`$ yarn add react-native-tpf-sdk`

With local:
You must download SDK and add it to your project:

<img src="/screen_shots/add_sdk.png" width="600" height="400">

Then, simply save the package as a project dependency in your root module to via NPM or YARN. To do this and install it automatically into your node_modules you can use this command:

`$ npm install --save file:your_paths/react-native-tpf-sdk-x.x.x.tgz`

Add dependencies:

```
@react-native-async-storage/async-storage
@react-native-community/datetimepicker
@react-native-community/masked-view
@react-navigation/native
@react-navigation/stack
axios
https
i18n-js
lodash
lodash.memoize
moment
prop-types
react
react-native
react-native-calendar-events
react-native-camera
react-native-datepicker
react-native-device-info
react-native-document-picker
react-native-fast-image
react-native-gesture-handler
react-native-image-crop-picker
react-native-keyboard-aware-scroll-view
react-native-masked-text
react-native-modal
react-native-modal-datetime-picker
react-native-modalize
react-native-permissions
react-native-reanimated
react-native-render-html
react-native-root-siblings
react-native-safe-area-context
react-native-safe-area-view
react-native-screens
react-native-simple-toast
react-native-snap-carousel
react-native-svg
react-native-swiper
react-native-switch-toggle
react-native-vnpay-merchant
react-redux
redux
redux-persist
redux-saga
reselect
rn-fetch-blob
react-native-tab-view
react-native-webview
react-native-autoheight-webview
react-native-maps
```

  <summary>IOS</summary>

```bash
cd ios && pod install && cd ..
```

##### Set up scheme

Update your project setting:

<img src="/screen_shots/schema.png"  width="800" height="800">

In file: AppDelegate.m, Add code:

```tsx
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
sourceApplication:(NSString *)sourceApplication
annotation:(id)annotation{
    if ([url.scheme isEqualToString:@"your scheme"]){
            //payment result
            return YES;
    }
```

Add "back" icon into asset to support VNPay SDK display back button.

<img src="/screen_shots/ios_back_icon.png"  width="800" height="638">

  <summary>Android</summary>

#### React Native <= 0.59

`$ react-native link react-native-tpf-sdk`

#### React Native > 0.60

You don't need to follow the guide mentioned above because autolinking from React already did the steps.

##### Set up scheme

Update file: AndroidManifest.xml

```tsx
<activity android:name="your activity" android:screenOrientation="portrait">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.BROWSABLE" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:scheme="xxxxx" />
  </intent-filter>
</activity>
```

Update file `android/build.gradle`

```tsx
 allprojects {
   repositories {
     maven {
       url("$rootDir/../node_modules/react-native-vnpay-merchant/android/repo")
     }
   }
}
```

Add "back" icon into asset to support VNPay SDK display back button.

<img src="/screen_shots/android_back_icon.png"  width="362" height="800">

### Usage

#### Importing

`import TpfSdk from 'react-native-tpf-sdk';`

#### Connecting

The TpfSdk is initialized with a context.

#### 1. Create client

Only one instance of TpfSdk should be instantiated and used at all times.

```tsx
import React, { useRef } from 'react';
import { View } from 'react-native';
import TpfSdk from 'react-native-tpf-sdk';
export const App = () => {
  const client = useRef();
  return (
    <View style={styles.container}>
      <TpfSdk ref={client} />
    </View>
  );
};
```

#### 2. Listeners

TpfSdk uses listener pattern to notify your app about specific events. You need to implement listeners for connection and object change events.

```tsx
import React, { useRef } from 'react';
import { View } from 'react-native';
import TpfSdk from 'react-native-tpf-sdk';
export const App = () => {
  const client = useRef();
  const onConnect = data => {
    console.log('onConnect', data);
  };
  const onDisConnect = data => {
    console.log('onDisConnect', data);
  };
  const onFailWithError = data => {
    console.log('onFailWithError', data);
  };
  const onRequestAccessToken = async () => {
    console.log('onRequestAccessToken');
    return 'new_your_access_token';
  };
  const onEventChange = data => {
    console.log('onEventChange', data);
  };
  const onRequestLogin = data => {
    console.log('onRequestLogin', data);
  };

  const clientEventHandlers = {
    onConnect: onConnect,
    onDisConnect: onDisConnect,
    onFailWithError: onFailWithError,
    onRequestAccessToken: onRequestAccessToken,
    onEventChange: onEventChange
    onRequestLogin: onRequestLogin
  };
  return (
    <View style={styles.container}>
      <TpfSdk ref={client} eventHandlers={clientEventHandlers} />
    </View>
  );
};
```

| onConnect: Function({userInfo: object})               |
| ----------------------------------------------------- |
| Invoked when the client connects to server successful |
| - userInfo: information of user account               |

| onDisConnect: Function({code: string, message: string}) |
| ------------------------------------------------------- |
| Invoked when the client disconnect to SDK               |
| - code: code of error                                   |
| - message: description of error                         |

| onFailWithError: Function({code: string, message: string) |
| --------------------------------------------------------- |
| Invoked when the client fails to connect to SDK           |
| - code: code of error                                     |
| - message: description of error                           |

| onRequestAccessToken: Function()                                         |
| ------------------------------------------------------------------------ |
| when token is expired, you must return new access token in this function |

| onEventChange: Function({event_name: string, data: object})           |
| --------------------------------------------------------------------- |
| Tracking user actions when user submit, update status, cancel in SDK  |
| - event_name: name of event                                           |
| \* credit_application_create: create Credit application               |
| \* credit_application_update: update Credit application               |
| \* credit_application_refund: refund for Credit application           |
| \* insurrance_application_create: create Insurrance application       |
| \* insurrance_application_update: update Insurrance application       |
| \* extra_service_application_create: create Extra-Service application |
| \* extra_service_application_update: update Extra-Service application |
| \* lead_create: create Lead                                           |
| \* lead_update: update Lead                                           |
| \* lead_fast_request_create: create Lead by fast request form         |
| \* lead_delete: delete Lead                                           |
| \* support_create: create Support ticket                              |
| \* support_update: update Support ticket                              |
| - data: data of action                                                |

| onRequestLogin: Function({showSdk: Function})                      |
| ------------------------------------------------------------------ |
| Invoked when SDK need accessToken and close SDK                    |
| - showSdk : Invoked when login success and client reconnect to SDK |

#### 3. Connect client

```tsx
useEffect(() => {
  client?.current?.connect({
    token: 'your_access_token'  // required: TPID access token or TPL access token
    user: {
      phone,                    // required: user phone
      first_name,               // required: first name
      last_name,                // required: last_name
      gender,                   // gender: MALE, FEMALE, OTHER
      dob                       // dd/MM/yyyy: The user must be over 18 years old (>=18)
    }
  });
}, []);
```

- token: TPID access token or TPL access token

#### 4. close sdk

You can close TpfSdk by calling:

```tsx
client?.current?.close();
```

#### 5. remoteAddress

attach domain name to call server

```tsx
<TpfSdk ref={client} remoteAddress={'https://htf-tpl-integration-gateway-qa.akachains.io/'} />
```

#### 6. theme

You can set theme (color, font family, position title, ....) by theme props:

```tsx
import React, { useRef } from 'react';
import { View } from 'react-native';
import TpfSdk from 'react-native-tpf-sdk';
export const App = () => {
  const client = useRef();
  const clientEventHandlers = {
    onConnect: onConnect,
    onDisConnect: onDisConnect,
    onFailWithError: onFailWithError,
    onRequestAccessToken: onRequestAccessToken,
    onEventChange: onEventChange
  };
  const DEFAULT_PREFIX_FONT_FAMILY = Platform.OS === 'ios' ? 'SVN-Gilroy' : 'SVN-Gilroy ';
  const theme = {
    app: {
      primaryColor1: '#FF951F',
      primaryColor2: '#178C77'
    },
    button: {
      primary: { textColor: '#FFFFFF', background: '#FF951F' },
      secondary: { textColor: '#313131', background: '#E6E9ED' },
      disablePrimary: { textColor: '#FFCE98', background: '#FFF4E9' },
      disableSecondary: { textColor: '#FFCE98', background: '#FFF4E9' }
    },
    icon: {
      color1: '#FF951F',
      color2: '#178C77',
      background: '#F3F9F8'
    },
    text: {
      primary: '#313131',
      secondary: '#A3A3A3',
      textAlign: 'left'
    },
    fonts: {
      BLACK: `${DEFAULT_PREFIX_FONT_FAMILY}Black`,
      BOLD: `${DEFAULT_PREFIX_FONT_FAMILY}Bold`,
      MEDIUM: `${DEFAULT_PREFIX_FONT_FAMILY}Medium`,
      REGULAR:
        Platform.OS === 'ios'
          ? `${DEFAULT_PREFIX_FONT_FAMILY}`
          : `${DEFAULT_PREFIX_FONT_FAMILY}Regular`,
      ITALIC: `${DEFAULT_PREFIX_FONT_FAMILY}Italic`,
      SEMIBOLD: `${DEFAULT_PREFIX_FONT_FAMILY}SemiBold`
    }
  };
  return (
    <View style={styles.container}>
      <TpfSdk ref={client} eventHandlers={clientEventHandlers} theme={theme} />
    </View>
  );
};
```

#### theme

- **app** - (`object`): set primary and secondary color for SDK

  - **primaryColor1** - (`string`) this is primary color of SDK includes: back button, action header menu, text tab focus, check box, radio button, hot/new mask icon, close button, help box icon, textinput focus, icon upload, switch button,...
  - **primaryColor2** - (`string`) this is secondary color of SDK includes: step number, hyperlink, helpbox (tooltip), slider bottom, highlight text, header menu button,...

- **button** - (`object`): set background color and text color button, it has 4 types of buttons:

  - **primary** - (`object`)
    - **textColor** - (`string`): text color of button
    - **background** - (`string`): background color of button
  - **secondary** - (`object`)
    - **textColor** - (`string`): text color of button
    - **background** - (`string`): background color of button
  - **disablePrimary** - (`object`)
    - **textColor** - (`string`): text color of button
    - **background** - (`string`): background color of button
  - **disableSecondary** - (`object`)
    - **textColor** - (`string`): text color of button
    - **background** - (`string`): background color of button

- **icon** - (`object`): set color for icon
  - **color1** - (`string`): primary color of icon
  - **color2** - (`string`): secondary color of icon
  - **background** - (`string`): background color of icon
- **text** - (`object`): set color for text
  - **primary** - (`string`): primary color of text
  - **secondary** - (`string`): secondary color of text (placeholder, note, description,...)
  - **textAlign** - (`string`): set position title of header, includes 3 types: left, center, right
- **fonts** - (`object`): set font family for text. Font family **SVN-Gilroy** is the default of the sdk.
  - **BLACK** - (`string`): is required
  - **BOLD** - (`string`): is required
  - **MEDIUM** - (`string`): is required
  - **REGULAR** - (`string`): is required
  - **ITALIC** - (`string`): is required
  - **SEMIBOLD** - (`string`): is required

##### Add fontFamily to SDK

In order for the fontFamily to work you must add fonts in your project (document: [Add custom Fonts in React Native](https://dev.to/aneeqakhan/add-custom-fonts-in-react-native-0-63-for-ios-and-android-3a9e)) then pass the font name you just added

```tsx
const theme = {
  fonts: {
    BLACK: 'your_font_family',
    BOLD: 'your_font_family',
    MEDIUM: 'your_font_family',
    REGULAR: 'your_font_family',
    ITALIC: 'your_font_family',
    SEMIBOLD: 'your_font_family'
    // ... other styles //
  }
};
return (
  <View style={styles.container}>
    <TpfSdk ref={client} theme={theme} />
  </View>
);
```

#### 7. Setting

You can set setting (scheme, ....) by setting props:

- **setting** - (`object`):
  - **scheme** - (`string`): scheme of your app
  - **appId** - (`string`): use to access the system to request api of the Onboarding flow.

```tsx
const SETTINGS = {
  scheme: 'your_scheme',
  appId: 'author_sdk_key'
};

<TpfSdk
  ref={client}
  eventHandlers={clientEventHandlers}
  theme={theme}
  remoteAddress={'https://htf-tpl-integration-gateway-qa.akachains.io/'}
  setting={SETTINGS}
/>;
```

#### API

##### 1. changeLanguage

Change language in SDK. Currently only support 2 languages English and Vietnamese

```tsx
client.current.changeLanguage(lang);
```

- **lang** - (`string`): 'en' or 'vi'

##### 2. showApplications

```tsx
client.current.showApplications(params);
```

- **params** - (`object`)

  - **code** - (`string`): includes two values

  - **data** - (`object`) (optional): option to active tab in application screen.

    - **tab** - (`int`): active tab (0: "Tài chính" tab; 1: "Bảo hiểm" tab; 2: "DVCT" tab; 3: "Yêu cầu" tab; 4: "Yêu cầu hỗ trợ" tab)

| params                       |      description      |                                  screen shot                                  |
| ---------------------------- | :-------------------: | :---------------------------------------------------------------------------: |
| { code: 'create_request'}    |  create request flow  | <img src="/screen_shots/create_request_screen.png"  width="250" height="500"> |
| { code: 'application_list' } | application list flow |   <img src="/screen_shots/application_list.png"  width="250" height="500">    |

##### 3. showBalance

```tsx
client.current.showBalance();
```

<img src="/screen_shots/balance_screen.png" width="300" height="600">

##### 4. showRefund

```tsx
client.current.showRefund();
```

<img src="/screen_shots/refund_screen.png" width="300" height="600">

##### 5. showProductSuggest

```tsx
client.current.showProductSuggest(params);
```

- **params** - (`object`)
  - **productCode** - (`string`): productCode is the code of Product for which you want to see TPF's recommended products

<img src="/screen_shots/product_suggest_screen.png"  width="300" height="600">

##### 6. showProducts

```tsx
client.current.showProducts(params);
```

| params                    |         description          |                                 screen shot                                  |
| ------------------------- | :--------------------------: | :--------------------------------------------------------------------------: |
| { code: 'credit' }        |         credit flow          |    <img src="/screen_shots/credit_screen.png"  width="250" height="500">     |
| { code: 'insurance' }     |        insurance flow        |   <img src="/screen_shots/insurance_screen.png"  width="250" height="500">   |
| { code: 'extra_service' } |      extra service flow      | <img src="/screen_shots/extra_service_screen.png"  width="250" height="500"> |
| { triggerCode: '' }       | product by trigger code flow | <img src="/screen_shots/product_trigger_flow.png"  width="250" height="500"> |

#### Guest Flow

<!-- ##### 1. Guest -->

- Guest users can connect to SDK and view the products (Credit, Insurance, Extra service) without login.

```tsx
client?.current?.showProductSuggest({ productCode });

client?.current?.showProducts({ triggerCode: inputTriggerCode });
```

 <img src="/screen_shots/onboarding/view_product_guest.png"  width="250" height="500"/>

- Guest users cannot view the flows: manage records, manage request support, create quick requests, create support requests, view commission account information.

- When user click touchpoints will show popup require login:

```tsx
client?.current?.showApplications(data);

client?.current?.showHistorys();

client?.current?.showBalance();

client?.current?.showRefund();
```

 <img src="/screen_shots/onboarding/manager_touchpoint_guest.png"  width="250" height="500"/>
  <img src="/screen_shots/onboarding/require_login_guest.png"  width="250" height="500"/>

- When user has not logged in to host app => show error, disconnect SDK and navigate to login screen of host app :

```tsx
TpfSdkClient.requestLogin(routeName, params, callBack);
```

- **routeName** - (`string`): a destination name of the route that has been defined somewhere.

- **params** - (`object`) (optional): params to pass to the destination route.

- **callBack** - (`function`): Invoked after function **requestLogin** called.

  <img src="/screen_shots/onboarding/create_file_guest.png"  width="250" height="500"/>
    <img src="/screen_shots/onboarding/create_file_dvct_guest.png"  width="250" height="500"/>
  <img src="/screen_shots/onboarding/create_file_error_guest.png"  width="250" height="500"/>

- When function requestLogin called then callback function onRequestLogin :

```tsx
const [reConnect, setReconnect] = useState(null);
const onRequestLogin = ({ showSdk }) => {
  setReconnect({ showSdk });
};
```

- if user login successfully, need to call **connect** SDK and call to action **showSdk** to reconnect SDK.

```tsx
  const onAuthorize = async () => {
    try {
      const response = await apiLogin({
        grant_type: 'password',
        scope: 'openid profile email phone IdentityServerApi',
        username: userName,
        password
      });

      if (response.status === 200) {
        let data = response.data;
        const token = data.access_token || '';
        client?.current?.connect({
          token,
          user: {
            first_name,
            last_name,
            phone
          }
        });
        if (reConnect) {
          reConnect?.showSdk(); // reconnect SDK
          setReconnect(null);   // clear reconnect
        }
        Alert.alert('Login success');
      } else {
        Alert.alert('Failed to login', `${response?.data?.error_description}`);
      }
    } catch (error) {
      Alert.alert('Failed to login', `${error?.code}\n${error?.message}`);
    }
  };
};
```


### 8. React Native Map SDK

Follow [react-native-maps document](https://github.com/react-native-maps/react-native-maps) to add package and setup for application.

### Enabling Google Maps
#### For IOS:
- Add the following to your **Podfile** and run pod install in the ios folder:
```
# React Native Maps dependencies
rn_maps_path = '../node_modules/react-native-maps'
pod 'react-native-google-maps', :path => rn_maps_path
```
 - Add the **Google API key** and edit your **AppDelegate.m** as follows:

```
+ #import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate
...

(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
+  [GMSServices provideAPIKey:@"_YOUR_API_KEY_"]; // add this line using the api key obtained from Google Console
...
```
#### For Android:
```
<application>
   <!-- You will only need to add this meta-data tag, but make sure it's a child of application -->
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="Your Google maps API Key Here"/>
</application>
```
