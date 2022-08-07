import React from 'react';
import { styles } from './styles';
import AppText from '../../components/app_text';
import { TEXT_COLOR } from '../../constants/colors';

const Title3 = ({
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
    styles.title3,
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

export default React.memo(Title3);
