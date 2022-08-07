module.exports = {
  options: {
    debug: false,
    removeUnusedKeys: false,
    sort: true,
    func: {
      list: ['translate'],
      extensions: ['.js', '.jsx'],
    },
    trans: false,
    lngs: ['vi'],
    ns: ['translation'],
    defaultLng: 'vi',
    defaultNs: 'translation',
    defaultValue: () => '',
    resource: {
      loadPath: 'src/assets/localize/{{lng}}.json',
      savePath: 'src/assets/localize/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    nsSeparator: ':',
    keySeparator: '.',
  },
};
