# How to build android apk

First `cd` to project.

To build apk use server dev run:

```sh
$ yarn build-dev2
```

To build apk use server product run:

```sh
$ yarn build-prod
```

You can update app version and bundle id in `.env.dev2` and `.env.production` in the root of project.

# Generate Android signed apk

1. Run `npm run bundle-android` or `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`.
2. Go to project root and open `/.env.dev2` and `/.env.production` to update version and build number (increase `APP_VERSION_CODE`).
3. Run `yarn build-dev2` or `npm run build-dev2` (to build dev server) and `yarn build-prod` or `npm run build-prod` (to build prod server).
4. You can find generated release apks in `/android/app/build/outputs/apk/` folder. There can be `dev2` and `production` folders.

**Sign the app**

1. For the first time you need to get the `apksigner` and `showsourcing.jks` (Ask admin or developer for the `showsourcing.jks` file). If you have these two files just go to `step 2`.
   Run this command to generate the `apksigner` (run anywhere you like)

   `ln -s ~/Library/Android/sdk/build-tools/27.0.3/apksigner ./apksigner`

2. Create a new folder (e.g `ShowSourcingSign`) and add `showsourcing.jks`, `apksigner` and generated release apk(s) (e.g `app-production-release.apk`, `app-dev2-release.apk`) there
3. In the newly generated folder (`ShowSourcingSign`) run the following command

   `./apksigner sign --ks showsourcing.jks --ks-key-alias ShowSourcing_PROD -v --max-sdk-version 27 app-production-release.apk`

   or `{YOUR_APP_NAME}.apk`, depends on which apk you want to sign. You need to set exact the same name

4. Enter the password. Ask admin or developer for the password.
5. Done

# Generate iOS release app

1. Start bundle using `yarn start` or `npm start`.
2. Change the Version and Build number in General in XCode
3. Choose env to build from schemas and set the device to Generic IOS Device
4. Archive the app from xCode (in Product tab)
