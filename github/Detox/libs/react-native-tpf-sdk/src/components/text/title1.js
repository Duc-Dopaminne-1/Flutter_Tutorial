import React, { useContext } from 'react';
import AppText from '../../components/app_text';
import { TEXT_COLOR } from '../../constants/colors';
import { styles } from './styles';

const Title1 = ({
  color,
  style,
  children,
  disabled,
  translate,
  numberOfLines,
  textAlign,
  medium = false,
  bold = true,
  italic,
  semiBold = false,
  light = false
}) => {
  const styleText = [
    styles.title1,
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

export default React.memo(Title1);
