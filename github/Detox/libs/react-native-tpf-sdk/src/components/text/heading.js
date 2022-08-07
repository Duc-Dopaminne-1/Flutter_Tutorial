import React, { useContext } from 'react';
import themeContext from '../../constants/theme/themeContext';
import AppText from '../../components/app_text';
import { TEXT_COLOR } from '../../constants/colors';
import { styles } from './styles';

const Heading = ({
  children,
  color,
  style,
  disabled,
  numberOfLines,
  textAlign,
  translate,
  medium = false,
  bold = true,
  italic,
  semiBold = false,
  light = false
}) => {
  const styleText = [
    styles.heading,
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

export default React.memo(Heading);
