const {replaceEnvFile, replaceGraphqlEnv} = require('./replaceEnvFile');

replaceEnvFile('.env.uat', '.env');
replaceEnvFile('.env.uat', 'fastlane/.env.default');
replaceEnvFile('fastlane/.env.uat', 'fastlane/.env');

replaceGraphqlEnv('uat');

replaceEnvFile('ios/DevTopenland/App-uat.entitlements', 'ios/DevTopenland/App.entitlements');
replaceEnvFile(
  'ios/DevTopenland/GoogleService-Info-uat.plist',
  'ios/DevTopenland/GoogleService-Info.plist',
);

replaceEnvFile('android/gradle-dev.properties', 'android/gradle.properties');
replaceEnvFile('android/app/google-services-uat.json', 'android/app/google-services.json');

// eslint-disable-next-line no-console
console.log('replace uat env success');
