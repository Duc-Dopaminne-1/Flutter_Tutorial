# Universal link and deep linking

## Setup

https://developer.android.com/training/app-links/verify-site-associations
https://developer.android.com/studio/write/app-link-indexing
android:path
android:pathPrefix
android:pathPattern

- Android:
  - Get sha256 with following command line:
    ```
    keytool -list -v -keystore my-release-key.keystore
    ```
  - Fill in the sha256 to assetlinks.json
  - Check assetlinks:
  ```
  https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://dev.topenland.com&relation=delegate_permission/common.handle_all_urls
  ```
  ```
  adb shell am start -a android.intent.action.VIEW \
  -c android.intent.category.BROWSABLE \
  -d "http://dev.topenland.com/account/transaction/1111/booking"
  ```

## How to test

- Android:
  ```
  adb shell am start -W -a android.intent.action.VIEW -d devtopenland://account/transaction/1111/booking
  adb shell am start -W -a android.intent.action.VIEW -d https://uat.topenland.com/account/transaction/1111/booking
  adb shell am start -a -c android.intent.action.VIEW -d https://uat.topenland.com/account/transaction/1111/booking
  ```
- iOS:

  ```
  xcrun simctl openurl booted devtopenland://home

  xcrun simctl openurl booted devtopenland://account/transaction/1111/booking

  ```
