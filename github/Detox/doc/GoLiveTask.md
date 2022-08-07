# Go Live Preparation

## <span style="color:green">Choose app identifer</span>

<details>

<summary>1. Choose app bundle id</summary>
Description: Client need to decide app bundle id to create app on Stores and update on source code

- [ ] iOS and Android bundle id. Ex: com.topenlandcorp.topenland

</details>

<details>

<summary>2. Choose app name</summary>
Description: Client need to decide official app name to display to user

- [ ] iOS and Android name. Ex: Topenland

</details>

<details>

<summary>3. Choose app version number</summary>
Description: Client need to decide version number for publishing app. Ex: 1.0.0 instead of 0.0.8 while developing

</details>

---

## <span style="color:green">Assets Preparation</span>

<details>

<summary>1. App icons</summary>
Description: App icons to display on Home screen of the phone, notification icon...

- [ ] iOS icons: https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/
- [ ] Android icons: https://developer.android.com/google-play/resources/icon-design-specifications

</details>

<details>

<summary>2. Splash screen images (only when need to change the current one)</summary>
Description: The splash screen display quickly when user click the app on Phone and before other screen display

- [ ] iOS
- [ ] Android

</details>

<details>

<summary>3. Promote video and images to display on Stores</summary>
Description: To promote the app on Stores, we need a preview video (optional) and product images

- [ ] iOS
- [ ] Android
- [ ] Reference link: Please check the 'Create app meta data on App Store and Google Play' item bellow

</details>

---

## <span style="color:green">Create app meta data on App Store and Google Play</span>

<details>

<summary>1. Create iOS app on App Store Connect</summary>
Description: Client need to log in App Store Connect and create new app

- [ ] Create app on apple store with chosen app bundle id, app name
- [ ] Fill in the app information, upload app meta data (icons, screenshot, video)
- [ ] Reference link: https://help.apple.com/app-store-connect/#/dev2cd126805
- [ ] Review Guideline link: https://developer.apple.com/app-store/review/guidelines/

</details>

<details>

<summary>2. Create Android app on Google Play Console</summary>
Description: Client need to log in Google Play Console and create new app

- [ ] Create app on Google Play console with chosen app bundle id, app name
- [ ] Fill in the app information, upload app meta data (icons, screenshot, video)
- [ ] Reference link: https://support.google.com/googleplay/android-developer/answer/113469?hl=en&ref_topic=7072031
- [ ] Review Guideline link: https://developer.android.com/distribute/best-practices/launch/launch-checklist

</details>

---

## <span style="color:green">Update source code</span>

<details>

<summary>1. Create new configs, script to build app for production</summary>
Description: With production environment, client need to build the app on their own. NashTech will support to create new configs, script, update code for production.

- [x] Generate icons with different sizes and update to source code (NashTech will do)
- [x] Generate Splash screen image with different sizes and update to source code (NashTech will do)
- [x] Create new target for iOS, build variant for Android with new app bundle id, app name (NashTech will do)
- [ ] Create new app on FireBase, OneSignal for production (NashTech/Client will do)
- [ ] Update Backend, mobile with new config of Firebase, OneSignal, VnPay, Google Map for production (Client will do)
- [ ] Create App production env config file (Client will do)
- [x] Create App production related script (NashTech will do)
- [ ] Create Fastlane env config file (Client will do)
- [x] Create Fastlane related script (NashTech will do)
- [x] Create build, deploy scripts, variables for new target (NashTech will do)
- [ ] Apply code push to force or suggest user update app version when needed (NashTech will do)
- [ ] Create new Fastlane script to deploy app to Google Play and App Store (Beta) (NashTech will do after first version of apps available on Stores)

</details>

---

## <span style="color:green">Manually deploy first apps version to store for review</span>

<details>

<summary>1. Deploy Beta version of app to Google Play and App Store</summary>
Description: Client uses the script to deploy app to Google Play, App Store

- [ ] Deploy Beta app to Google Play and App Store
- [ ] Go to the Store console to commit the app to be ready for review by Google and Apple
- [ ] Wait for the approval for testing Beta version from Stores

</details>

<details>
<summary>2. Test Beta version from Stores thoroughly</summary>
Description: We need to test the Beta version apps from Stores thoroughly before officially publish the apps and waiting for review

</details>

<details>
<summary>3. Publish app to Google Play and App Store</summary>
Description: Client uses Google Play console and App Store connect to promote Beta versions to production, waiting for review and publish the apps when they are approved by Google and Apple

</details>

---

## <span style="color:green">Deploy updated versions from AppCenter(Client will do)</span>

<details>

<summary>1. Deploy updated versions to Stores from App Center</summary>
Description: Client follow the instruction of App Center to deploy app to Apple App Store or Google Play Console if needed

- [ ] Deploy to Apple App Store instruction: https://docs.microsoft.com/en-us/appcenter/distribution/stores/apple
- [ ] Deploy to Google Play Store instruction: https://docs.microsoft.com/en-us/appcenter/distribution/stores/googleplay

</details>

---
