module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [1, 'never'],
    'scope-min-length': [2, 'always', 2],
    // 'scope-case': [2, 'always', ['pascal-case']],
  },
};
