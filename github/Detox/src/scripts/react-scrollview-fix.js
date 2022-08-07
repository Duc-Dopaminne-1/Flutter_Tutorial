const fs = require('fs');

try {
  const rootDir = process.cwd();
  const file = `${rootDir}/libs/react-native-spring-scrollview/SpringScrollView.js`;
  const data = fs.readFileSync(file, 'utf8');
  const dataFix = 'react-native/Libraries/Components/TextInput/TextInputState';

  if (data.indexOf(dataFix) !== -1) {
    throw '> Already fixed'; // NOSONAR to log error string in console only
  }

  const result = data.replace(/react-native\/lib\/TextInputState/g, dataFix);
  fs.writeFileSync(file, result, 'utf8');
} catch (error) {
  console.error(error);
}
