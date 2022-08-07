import React, { useContext } from 'react';
import themeContext from '../../constants/theme/themeContext';
import AppText from '../../components/app_text';
import { TEXT_COLOR } from '../../constants/colors';
import { styles } from './styles';

const BoldTitle = ({
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
  const { fonts } = useContext(themeContext);
  const styleText = [
    styles.boldTitle,
    color ? { color: color } : {},
    disabled ? { color: TEXT_COLOR.PrimaryDisable } : {},
    bold ? { fontFamily: fonts.BOLD } : {},
    italic ? { fontFamily: fonts.ITALIC } : {},
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

export default React.memo(BoldTitle);
