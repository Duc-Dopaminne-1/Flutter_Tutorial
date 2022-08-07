const {replaceEnvFile, replaceGraphqlEnv} = require('./replaceEnvFile');

replaceEnvFile('.env.qa', '.env');
replaceEnvFile('.env.qa', 'fastlane/.env.default');
replaceEnvFile('fastlane/.env.qa', 'fastlane/.env');

replaceGraphqlEnv('qa');

replaceEnvFile('ios/DevTopenland/App-qa.entitlements', 'ios/DevTopenland/App.entitlements');
replaceEnvFile(
  'ios/DevTopenland/GoogleService-Info-qa.plist',
  'ios/DevTopenland/GoogleService-Info.plist',
);

replaceEnvFile('android/gradle-dev.properties', 'android/gradle.properties');
replaceEnvFile('android/app/google-services-qa.json', 'android/app/google-services.json');

// eslint-disable-next-line no-console
console.log('replace qa env success');
