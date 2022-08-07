import React from 'react';
import AppText from '../../components/app_text';
import { TEXT_COLOR } from '../../constants/colors';
import { styles } from './styles';

const Title2 = ({
  children,
  color,
  style,
  disabled,
  numberOfLines,
  translate,
  textAlign,
  medium = false,
  bold = true,
  italic,
  semiBold = false,
  light = false
}) => {
  const styleText = [
    styles.title2,
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

export default React.memo(Title2);
