import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { ICRadioCheck, ICRadioUncheck } from '../../assets/icons';
import BodyText from '../../components/text/body_text';
import { CUSTOM_COLOR } from '../../constants/colors';
import styles from './styles';
import themeContext from '../../constants/theme/themeContext';

const RadioBox = ({ label, value, style, checked, onChange, labelStyle, disable, translate }) => {
  const theme = useContext(themeContext);
  const onPress = () => {
    onChange(value);
  };
  return (
    <TouchableOpacity
      onPress={!disable ? onPress : null}
      style={[styles.checkBoxWrapper, style]}
      activeOpacity={!disable ? 0.8 : 1}>
      {checked === value ? (
        <ICRadioCheck
          fill={disable ? CUSTOM_COLOR.Bombay : CUSTOM_COLOR.PersianGreen}
          color1={theme.app.primaryColor1}
        />
      ) : (
        <ICRadioUncheck fill={CUSTOM_COLOR.Bombay} />
      )}
      <BodyText
        translate={translate}
        numberOfLines={1}
        style={[
          styles.label,
          { color: disable ? CUSTOM_COLOR.Bombay : theme.text.primary },
          labelStyle
        ]}>
        {label}
      </BodyText>
    </TouchableOpacity>
  );
};

export default React.memo(RadioBox);
