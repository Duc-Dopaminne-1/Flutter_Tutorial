const {replaceEnvFile, replaceGraphqlEnv} = require('./replaceEnvFile');

replaceEnvFile('.env.dev', '.env');
replaceEnvFile('.env.dev', 'fastlane/.env.default');
replaceEnvFile('fastlane/.env.dev', 'fastlane/.env');

replaceGraphqlEnv('dev');

replaceEnvFile('ios/DevTopenland/App-dev.entitlements', 'ios/DevTopenland/App.entitlements');
replaceEnvFile(
  'ios/DevTopenland/GoogleService-Info-dev.plist',
  'ios/DevTopenland/GoogleService-Info.plist',
);

replaceEnvFile('android/gradle-dev.properties', 'android/gradle.properties');
replaceEnvFile('android/app/google-services-dev.json', 'android/app/google-services.json');

// eslint-disable-next-line no-console
console.log('replace dev env success');
