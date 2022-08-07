# Development Guide

## 1. Clean up and install dependencies

Description: Run command line to clean up environment and install necessary dependencies for development react native app
Reference: Scripts are on package.json file

```
yarn clean
```

## 2. Change environment variables

Description: Run command line for changing to specific environment
Reference: Scripts are on package.json file

```
  yarn env:dev ==> for Dev environment
  yarn env:qa ==> for Qa environment
  yarn env:sec ==> for Sec environment
  yarn env:uat ==> for Uat environment
  yarn env:prod ==> for Production environment
```

## 3. Build iOS

Description: Run command line to build iOS on simulator
Reference: Scripts are on package.json file

```
yarn ios
```

## 4. Build Android

Description: Run command line to build Android on emulator or connected device
Reference: Scripts are on package.json file

```
yarn android
```

**Troubleshooting**: If build Android failed, we can open Android Studio and click on elephen icon ("Sync Project with Gradle files") to let Android Studio fix some problems related to syncing gradle.

## 5. Check coding convention before commit code

Description: Run command line to check coding convention and fix coding rule errors before commit code to respository
Reference: Scripts are on package.json file

- Check eslint rules (required)

  ```
  yarn lint
  ```

- Check sonar rules (recommended)

  ```
  yarn sonar
  ```
