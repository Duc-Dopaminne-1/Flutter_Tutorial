import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import AppText from '../../components/app_text';
import { BUTTON_COLOR } from '../../constants/colors';
import { handleTouch } from '../../helpers/handleTouch';
import styles from './styles';
import themeContext from '../../constants/theme/themeContext';

const OutLineButton = ({
  title,
  count,
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
      backgroundColor: theme?.button?.outline?.background ?? BUTTON_COLOR.Outline
    },
    backgroundColor && { backgroundColor },
    { borderColor: theme?.button?.outline?.textColor }
  ]);
  const styleComposer = StyleSheet.compose(styles.button, styleCustom);
  const styleText = StyleSheet.compose(
    styles.title,
    colorText ? { color: colorText } : { color: theme?.button?.outline?.textColor }
  );

  const { topenId } = useSelector(state => state.auth);

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
          backgroundColor: theme.button.disableOutline.background
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
              (disabledText ? disabledText : { color: theme.button.disableOutline.textColor })
          ]}>
          {title}
          {count > 0 ? `(${count})` : null}
        </AppText>
      )}
      {iconRight ? <View style={styles.iconRight}>{iconRight}</View> : null}
    </TouchableOpacity>
  );
};

OutLineButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  children: PropTypes.func,
  iconRight: PropTypes.any,
  height: PropTypes.number,
  isDefault: PropTypes.bool,
  fontSize: PropTypes.number,
  colorText: PropTypes.string,
  titleStyle: PropTypes.object,
  backgroundColor: PropTypes.string,
  backgroundColorDisabled: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  parentScreen: PropTypes.string
};

OutLineButton.defaultProps = {
  style: {},
  titleStyle: {},
  disabled: false,
  isDefault: false,
  disabledText: ''
};

export default React.memo(OutLineButton);
