import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { translate as trans } from '../../i18n/index';
import themeContext from '../../constants/theme/themeContext';

const selectText = createSelector(
  state => state.setting.lang,
  (_, children) => children,
  (_, children) => {
    return trans(children);
  }
);

const AppText = ({
  children,
  style,
  translate = false,
  bold = false,
  italic = false,
  medium = false,
  semiBold = false,
  ...props
}) => {
  const lang = useSelector(state => selectText(state, children));
  const { text, fonts } = useContext(themeContext) || {};

  const stylePrimaryText = [
    { color: text?.primary, fontFamily: fonts?.REGULAR },
    bold && { fontFamily: fonts?.BOLD },
    italic && { fontFamily: fonts?.ITALIC },
    medium && { fontFamily: fonts?.MEDIUM },
    semiBold && { fontFamily: fonts?.SEMIBOLD },
    style
  ];

  return (
    <Text {...props} style={stylePrimaryText} allowFontScaling={false}>
      {translate ? lang + '' : children}
    </Text>
  );
};

AppText.propTypes = {
  style: PropTypes.any,
  translate: PropTypes.bool,
  children: PropTypes.any
};

AppText.defaultProps = {
  translate: false
};

export default AppText;
