# Production configuration setup guide

## 1. Update related to Third parties

- [x] Firebase: Update the correct file of production Firebase project for firebase json file in the path: android/app/src/prod/google-services.json
- [x] OneSignal: Update Onesignal configure to the new value of production Onesignal project in production env file
- [ ] VNPay: mobile doesn't need to change code, just make sure Backend updates to the production vnpay info by testing payment feature that work correctly
- [x] Google Map: Update the correct key for Google Map SDK key for Android, iOS, Google Map Geo coding key in production env file

## 2. Create production env file mobile/env.prod

Description: Client creates the environment configuration for production and keep it secretly from git control of NashTech

- [x] Update configuration content in Encryption.test.js
- [x] Run test command to create obfuscated and encrypted environment content in console log

  ```
  yarn test Encryption.test.js
  ```

- [x] Copy the environment content to a newly created file named env.prod under Mobile/src folder

## 3. Create production key store file for Android

Description: Client need to create separate keystore file for production. Please refer to official guide of Google to create keystore file at the link https://developer.android.com/studio/publish/app-signing.html (using Android Studio or command line to create new keystore file).
After creating the upload keystore file, please duplicate the file Mobile/android/gradle-dev.properties to create a new file named gradle-prod.properties in the same folder and replace following credential info with the production info.
Note: build and deploy script for production env will automatically copy content from this

    ```
    MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
    MYAPP_RELEASE_KEY_ALIAS=my-key-alias
    MYAPP_RELEASE_STORE_PASSWORD=Topenland@1234
    MYAPP_RELEASE_KEY_PASSWORD=Topenland@1234
    ```

## 4. Replace universal and app link files on web portal

Description: Client need to replace universal and app link files on web portal to allow production apps to have association with production portal. So, when user clicks on a shared link on phone, the installed app will be opened instead of the website.

- [x] Check the content of 2 file apple-app-site-association and assetlinks.json in folder Mobile/doc/UniversalLinkDeepLinking to make sure it links to right bundle id of production app (ex: com.topenland)
- [x] Replace sha256 certificate fingerprint in file assetlinks.json with the value of production app.

  - [x] Run the following command line to get the Certificate fingerprints of production keystore:

    ```
      keytool -list -v -keystore android/app/<##production key file name##>.keystore
    ```

  - [x] Then replace value from 'Certificate fingerprints' > 'SHA256' from command line result to assetlinks.json in the "sha256_cert_fingerprints" key.

- [x] Replace those 2 files in production portal, in the public folder WebNext/public/.well-known, so that when the production web deployed, the app association links are applied
- [ ] Note: When deploy apps to production, it may take some days with iOS (Android may take just some munites or hours) to update these association files if app link files have some changes

## 5. Update Fastlane configuration

- [x] Update fastlane configuration with client's Appcenter credentials so that we still can deploy app to Appcenter along with Stores if needed

# Build and Deploy apps to stores:

Please follow the instruction in file "./DeployGuide.md" > 3. Build & Deploy to Store

# Check list to test the configuration

- [x] App can build and run normally in production environment
- [x] App connect to production backend apis, not other apis
- [x] App can receive push notification from production OneSignal
- [ ] User can make a payment successfully with transaction detail display at the end of transaction, not just blank transaction (relate to correct config VNPay ipn link or not)
- [x] User can open app with a link (ex: https://topenland.com/transaction) from content of other app like sms, note, email...
- [x] App can display Map normally
- [x] App can get long, lat value from an address normally (in create property post feature)
