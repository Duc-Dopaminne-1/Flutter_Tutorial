import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import themeContext from '../../constants/theme/themeContext';
import AppText from '../../components/app_text';
import { BUTTON_COLOR } from '../../constants/colors';
import { handleTouch } from '../../helpers/handleTouch';
import styles from './styles';

const SecondaryButton = ({
  title,
  style,
  width,
  height,
  onPress,
  disabled,
  children,
  fontSize,
  isDefault,
  colorText,
  iconRight,
  titleStyle,
  disabledText,
  iconRightStyle,
  backgroundColor,
  translate = false,
  backgroundColorDisabled,
  name,
  route,
  ...props
}) => {
  const theme = useContext(themeContext);

  const styleCustom = StyleSheet.flatten([
    style,
    width && { width },
    height && { height },
    !isDefault && {
      backgroundColor: theme?.button?.secondary?.background ?? BUTTON_COLOR.Secondary,
      borderWidth: 1,
      borderColor: theme?.button?.primary?.background
    },
    backgroundColor && { backgroundColor }
  ]);
  const styleComposer = StyleSheet.compose(styles.button, styleCustom);
  const styleText = StyleSheet.compose(
    styles.title,
    colorText ? { color: colorText } : { color: theme?.button?.secondary?.textColor }
  );

  const topenId = useSelector(state => state.auth.topenId);

  const _onPress = event => {
    onPress();
    handleTouch(event, name, route?.name, topenId);
  };

  return (
    <TouchableOpacity
      onPress={_onPress}
      disabled={disabled}
      style={[
        styleComposer,
        disabled && {
          backgroundColor: theme.button.disableSecondary.background
        },
        disabled &&
          backgroundColorDisabled && {
            backgroundColor: backgroundColorDisabled
          }
      ]}
      {...props}>
      {children ? (
        children
      ) : (
        <AppText
          translate={translate}
          bold={true}
          style={[
            styleText,
            titleStyle,
            fontSize && { fontSize },
            disabled &&
              (disabledText ? disabledText : { color: theme.button.disableSecondary.textColor })
          ]}>
          {title}
        </AppText>
      )}
      {iconRight ? <View style={[styles.iconRight, iconRightStyle]}>{iconRight}</View> : null}
    </TouchableOpacity>
  );
};

SecondaryButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.object,
  width: PropTypes.number,
  disabled: PropTypes.bool,
  children: PropTypes.func,
  iconRight: PropTypes.any,
  height: PropTypes.number,
  isDefault: PropTypes.bool,
  fontSize: PropTypes.number,
  colorText: PropTypes.string,
  titleStyle: PropTypes.object,
  backgroundColor: PropTypes.string,
  backgroundColorDisabled: PropTypes.string
};

SecondaryButton.defaultProps = {
  style: {},
  titleStyle: {},
  disabled: false,
  isDefault: false,
  disabledText: ''
};

export default React.memo(SecondaryButton);
