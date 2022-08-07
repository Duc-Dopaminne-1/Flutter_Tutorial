const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'https://sonar.topenland.com/',
    token: '96cb29c3c5db2d436773bed7ea6d58bdeb7d83e0',
    options: {
      'sonar.sources': 'src',
      'sonar.exclusions': 'src/api/graphql/generated/*,src/**/*.test.js', //ignore generated files
      'sonar.projectName': 'topenland/mobile-sb',
      'sonar.projectKey': 'mobile-sb',
      'sonar.javascript.file.suffixes': '.js,.jsx',
      'sonar.javascript.lcov.reportPaths': 'build/test/coverage/lcov.info',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.illegal-access': 'warn',
    },
  },
  () => process.exit(),
);
