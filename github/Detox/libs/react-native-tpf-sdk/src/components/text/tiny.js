import React, { useContext } from 'react';
import AppText from '../../components/app_text';
import { TEXT_COLOR } from '../../constants/colors';
import { styles } from './styles';

const Tiny = ({
  color,
  style,
  children,
  disabled,
  translate,
  numberOfLines,
  textAlign,
  medium = false,
  bold = false,
  italic,
  semiBold = false,
  light = false
}) => {
  const styleText = [
    styles.tiny,
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

export default React.memo(Tiny);
