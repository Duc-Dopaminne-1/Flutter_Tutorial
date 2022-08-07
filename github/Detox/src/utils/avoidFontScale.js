import {Text, TextInput} from 'react-native';

const NOT_ALLOW_FONT_SCALE = {allowFontScaling: false};

const avoidFontScale = () => {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;
};

export {avoidFontScale, NOT_ALLOW_FONT_SCALE};
