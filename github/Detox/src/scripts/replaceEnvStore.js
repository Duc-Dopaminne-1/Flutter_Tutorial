const {replaceEnvFile, replaceGraphqlEnv} = require('./replaceEnvFile');

replaceEnvFile('.env.prod', '.env');
replaceEnvFile('.env.prod', 'fastlane/.env.default');
replaceEnvFile('fastlane/.env.store', 'fastlane/.env');

replaceGraphqlEnv('prod');

replaceEnvFile('ios/DevTopenland/App-prod.entitlements', 'ios/DevTopenland/App.entitlements');
replaceEnvFile(
  'ios/DevTopenland/GoogleService-Info-prod.plist',
  'ios/DevTopenland/GoogleService-Info.plist',
);

replaceEnvFile('android/gradle-prod.properties', 'android/gradle.properties');
replaceEnvFile('android/app/google-services-prod.json', 'android/app/google-services.json');

// eslint-disable-next-line no-console
console.log('replace store env success');
