# README #

This README would normally document whatever steps are necessary to get your application up and running.

## Setup ##

bidbid-mobile is the directory containing the source code

Step 1: Dowload file ENV. (Please contact the Dev team to get the Env file)

Step 2: Move the debug.keystore file to (bidbid-mobile/android/app)

Step 3: Move the (.env, .env.dev, .env.staging) file to (bidbid-mobile)

Step 4: Open Xcode -> Double-click the file:
 * BidBid_AppStore.mobileprovision
 * BidBid_Distribution.mobileprovision

Step 5: Add below 2 files to keychain access 
 * development.cer
 * distribution.cer

Step 6: yarn && cd ios && pod install && cd ..

## Run Android App ##

* yarn run-android-dev : run app on android for Dev (env.dev)
* yarn run-android-staging : run app on android for Customer (env.staging)

## Build Android App ##

* yarn build-android-dev : build app on android for Dev (env.dev)
* yarn build-android-staging : build app on android for Customer (env.staging)

## Run IOS App ##

* Run app on IOS for Dev (env.dev)

![alt text](https://res.cloudinary.com/dx7kebr04/image/upload/v1626769680/Screen_Shot_2021-07-20_at_15.21.48_alm84s.png)

* Run app on IOS for Customer (env.staging)

![alt text](https://res.cloudinary.com/dx7kebr04/image/upload/v1626769831/Screen_Shot_2021-07-20_at_15.30.26_ncc3rb.png)

## Build IOS App ##

* Build app on IOS for Dev (env.dev)

![alt text](https://res.cloudinary.com/dx7kebr04/image/upload/v1626769747/Screen_Shot_2021-07-20_at_15.28.57_zv8jvw.png)

* Build app on IOS for Customer (env.staging)

![alt text](https://res.cloudinary.com/dx7kebr04/image/upload/v1626769990/Screen_Shot_2021-07-20_at_15.33.04_pksoor.png)
 

## Version socket stable
* socket.io-client": "2.3.1",
