import React, { useContext } from 'react';
import themeContext from '../../constants/theme/themeContext';
import AppText from '../../components/app_text';
import { TEXT_COLOR } from '../../constants/colors';
import { styles } from './styles';

const BodyText = ({
  children,
  color,
  style,
  disabled,
  numberOfLines,
  translate,
  textAlign,
  medium = false,
  bold = false,
  italic,
  semiBold = false,
  light = false
}) => {
  const styleText = [
    styles.bodyText,
    color ? { color } : {},
    disabled ? { color: TEXT_COLOR.PrimaryDisable } : {},
    textAlign,
    style
  ];
  return (
    <AppText
      style={[styleText]}
      numberOfLines={numberOfLines}
      translate={translate}
      bold={bold}
      italic={italic}
      medium={medium}
      semiBold={semiBold}
      light={light}>
      {children}
    </AppText>
  );
};

export default React.memo(BodyText);
