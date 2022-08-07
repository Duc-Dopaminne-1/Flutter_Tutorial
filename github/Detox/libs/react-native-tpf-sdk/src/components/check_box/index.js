import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { ICCheck, ICUncheck } from '../../assets/icons';
import BodyText from '../../components/text/body_text';
import { CUSTOM_COLOR } from '../../constants/colors';
import styles from './styles';
import themeContext from '../../constants/theme/themeContext';

const CheckBox = ({
  label,
  style,
  checked,
  disable,
  onChange,
  labelStyle,
  iconStyle,
  icCheck = null,
  icUncheck = null,
  translate = false,
  labelNumberLine = 1
}) => {
  const theme = useContext(themeContext);
  const onPress = () => {
    onChange?.(!checked);
  };
  return (
    <TouchableOpacity onPress={onPress} style={[styles.checkBoxWrapper, style]}>
      {checked ? (
        icCheck ? (
          icCheck
        ) : (
          <ICCheck
            style={iconStyle}
            fill={disable ? CUSTOM_COLOR.Bombay : theme.app.primaryColor1}
          />
        )
      ) : icUncheck ? (
        icUncheck
      ) : (
        <ICUncheck style={iconStyle} fill={CUSTOM_COLOR.Bombay} />
      )}
      <BodyText
        translate={translate}
        numberOfLines={labelNumberLine}
        medium={true}
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

export default React.memo(CheckBox);
