const {replaceEnvFile, replaceGraphqlEnv} = require('./replaceEnvFile');

replaceEnvFile('.env.tma', '.env');
replaceEnvFile('.env.tma', 'fastlane/.env.default');
replaceEnvFile('fastlane/.env.tma', 'fastlane/.env');

replaceGraphqlEnv('tma');

replaceEnvFile('ios/DevTopenland/App-tma.entitlements', 'ios/DevTopenland/App.entitlements');
replaceEnvFile(
  'ios/DevTopenland/GoogleService-Info-dev.plist',
  'ios/DevTopenland/GoogleService-Info.plist',
);

replaceEnvFile('android/gradle-dev.properties', 'android/gradle.properties');
replaceEnvFile('android/app/google-services-dev.json', 'android/app/google-services.json');

// eslint-disable-next-line no-console
console.log('replace tma env success');
