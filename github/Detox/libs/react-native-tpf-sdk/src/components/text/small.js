import React, { useContext } from 'react';
import themeContext from '../../constants/theme/themeContext';
import AppText from '../../components/app_text';
import { FONT_FAMILY } from '../../constants/appFonts';
import { TEXT_COLOR } from '../../constants/colors';
import { styles } from './styles';

const Small = ({
  children,
  color,
  style,
  disabled,
  numberOfLines,
  translate = false,
  textAlign,
  medium = false,
  bold = false,
  italic,
  semiBold = false,
  light = false
}) => {
  const styleText = [
    styles.small,
    color ? { color: color } : {},
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

export default React.memo(Small);
