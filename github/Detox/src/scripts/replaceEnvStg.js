const {replaceEnvFile, replaceGraphqlEnv} = require('./replaceEnvFile');

replaceEnvFile('.env.stg', '.env');
replaceEnvFile('.env.stg', 'fastlane/.env.default');
replaceEnvFile('fastlane/.env.stg', 'fastlane/.env');

replaceGraphqlEnv('stg');

replaceEnvFile('ios/DevTopenland/App-stg.entitlements', 'ios/DevTopenland/App.entitlements');
replaceEnvFile(
  'ios/DevTopenland/GoogleService-Info-stg.plist',
  'ios/DevTopenland/GoogleService-Info.plist',
);

replaceEnvFile('android/gradle-dev.properties', 'android/gradle.properties');
replaceEnvFile('android/app/google-services-stg.json', 'android/app/google-services.json');

// eslint-disable-next-line no-console
console.log('replace stg env success');
