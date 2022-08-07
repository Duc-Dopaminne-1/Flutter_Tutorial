# Mobile project structure

```
├─ __ mock __: mock data and server to support development while server has not ready yet

├─ android: native android code

├─ doc: document folder for this project

├─ fastlane: script to deploy apps

├─ ios: native ios code

├─ libs: custom react native modules

├─ src: main source code folder

│  ├─ api: code related to api call: graphql & restful

│  ├─ appData: global app data: redux store, react hooks

|  ├─ assets: static assets of project like images, icons, fonts, strings, theme, etc

│  ├─ components: common UI components that can be reused in multiple places

│  ├─ configs: environment configuration

│  ├─ pushNotification: handle push notification integration (OneSignal)

│  ├─ screens: UI screens of the app

│  ├─ scripts: custom scripts to support development like environment changing, patching code

│  ├─ service: service code to support business

│  ├─ storage: common data local and secure storage

│  ├─ utils: common utility to support business code

├─ App.js: entry point to the app source code

├─ index.js: entry point to the react native application code

├─ .env.*: encrypted environment variables

├─ package.json: react native dependency management and main custom scripts of project

├─ Gemfile: fastlane auto generated file

├─ Gemfile.lock: lock fastlane versions

├─ graphql-gen.yml: script to generate graphql code

├─ ReadMe.md: entry documentation to navigate to other important documents of project

├─ Release Note: latest release note for current release apps

├─ sonar-project.js: configuration to connect to sonar queue

├─ transformer.js: configuration for obfuscate javascript code

├─ yarn.lock: lock dependency versions
```
