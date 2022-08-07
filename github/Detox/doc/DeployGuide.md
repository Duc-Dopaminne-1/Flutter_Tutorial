# Build and Deploy guide

## 1. Prepare source code

- Update release note content:

  - Update ReleaseNote.md and ReleaseNotes.md files

- Clean code and install packages:

  ```
  yarn deploy:clean
  ```

- Increase app version:
  ```
  yarn version:up:build => only increase build number (used within interim)
  yarn version:up:patch => for internal build within iteration (used for new interim release)
  yarn version:up:minor => each iteration increase minor just once (used for new phase)
  yarn version:up:major => for build store (customer decide)
  ```

## 2. Build & Deploy to AppCenter

Build and deploy app to AppCenter after prepare source code step above

- Android:

  ```
  yarn deploy:android:appcenter:dev ==> for Dev environment
  yarn deploy:android:appcenter:qa ==> for Qa environment
  yarn deploy:android:appcenter:sec ==> for Sec environment
  yarn deploy:android:appcenter:uat ==> for Uat environment
  yarn deploy:android:appcenter:prod ==> for Production environment
  ```

- iOS:

  ```
   yarn deploy:ios:appcenter:dev ==> for Dev environment
   yarn deploy:ios:appcenter:qa ==> for Qa environment
   yarn deploy:ios:appcenter:sec ==> for Sec environment
   yarn deploy:ios:appcenter:uat ==> for Uat environment
   yarn deploy:ios:appcenter:prod ==> for Production environment
  ```

## 3. Build & Deploy to Store

Build and deploy app to Stores **_ONLY AFTER_** step '1. Prepare source code' above

- Android:

  - Build in production mode:

  ```
  yarn build:android:bundle:prod ==> for creating Production bundle (Recommended)
  yarn build:android:apk:prod ==> for creating Production apk (not recommended)
  ```

  - Builded file will be generated in following path:
    - Mobile/android/app/build/outputs/bundle/app-prod-release.aab
    - Mobile/android/app/build/outputs/apk/app-prod-release.apk
  - Manually upload builded file (bundle file **_OR_** apk file) to Google Console

- iOS:
  - Manually build and upload to Store Connect:
    - Change OneSignal identifier to appropriate production value:
      com.topenland.OneSignalNotificationServiceExtension
    - Use Xcode to archive ProdTopenland target
    - Upload to Store Connect
