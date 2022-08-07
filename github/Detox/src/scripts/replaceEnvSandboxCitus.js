const {replaceEnvFile, replaceGraphqlEnv} = require('./replaceEnvFile');

replaceEnvFile('.env.sandboxcitus', '.env');
replaceEnvFile('.env.sandboxcitus', 'fastlane/.env.default');
replaceEnvFile('fastlane/.env.sandboxcitus', 'fastlane/.env');

replaceGraphqlEnv('sandboxcitus');

replaceEnvFile(
  'ios/Detox/App-sandboxcitus.entitlements',
  'ios/Detox/App.entitlements',
);
replaceEnvFile(
  'ios/Detox/GoogleService-Info-sandboxcitus.plist',
  'ios/Detox/GoogleService-Info.plist',
);


// eslint-disable-next-line no-console
console.log('replace sandboxcitus env success');
