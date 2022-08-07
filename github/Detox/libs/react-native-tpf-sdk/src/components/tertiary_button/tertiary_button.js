import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../../components/app_text';
import styles from './styles';

const TertiaryButton = ({
  title,
  style,
  width,
  height,
  onPress,
  disabled,
  children,
  fontSize,
  colorText,
  iconRight,
  titleStyle,
  borderColor,
  backgroundColor,
  translate = false,
  showBorderDisabled,
  ...props
}) => {
  const styleCustom = StyleSheet.flatten([
    style,
    width && { width },
    height && { height },
    backgroundColor && { backgroundColor },
    borderColor && { borderColor: borderColor }
  ]);
  const styleComposer = StyleSheet.compose(styles.tertiaryButtonWrapper, styleCustom);
  const styleText = StyleSheet.compose(styles.title, colorText ? { color: colorText } : {});

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styleComposer, disabled && !showBorderDisabled && styles.borderDisabled]}
      {...props}>
      {children ? (
        children
      ) : (
        <AppText
          translate={translate}
          bold={true}
          style={[styleText, titleStyle, fontSize && { fontSize }]}>
          {title}
        </AppText>
      )}
      {iconRight ? <View style={styles.iconRight}>{iconRight}</View> : null}
      {disabled ? (
        <View style={[styles.disabled, width && { width }, height && { height }]} />
      ) : null}
    </TouchableOpacity>
  );
};

TertiaryButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.object,
  width: PropTypes.number,
  disabled: PropTypes.bool,
  children: PropTypes.func,
  iconRight: PropTypes.any,
  height: PropTypes.number,
  fontSize: PropTypes.number,
  colorText: PropTypes.string,
  titleStyle: PropTypes.object,
  borderColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  showBorderDisabled: PropTypes.bool
};

TertiaryButton.defaultProps = {
  style: {},
  titleStyle: {},
  disabled: false,
  showBorderDisabled: false
};

export default React.memo(TertiaryButton);
