import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../../components/app_text';
import styles from './styles';

const HighlightButton = ({
  title,
  style,
  onPress,
  children,
  colorText,
  iconRight,
  translate = false,
  ...props
}) => {
  const styleCustom = StyleSheet.flatten(style);
  const styleComposer = StyleSheet.compose(styles.highlightButtonWrapper, styleCustom);
  const styleText = StyleSheet.compose(styles.title, colorText ? { color: colorText } : {});
  return (
    <TouchableOpacity onPress={onPress} style={styleComposer} {...props}>
      {children ? (
        children
      ) : (
        <AppText translate style={styleText} bold={true}>
          {title}
        </AppText>
      )}
      {iconRight ? <View style={styles.iconRight}>{iconRight}</View> : null}
    </TouchableOpacity>
  );
};

HighlightButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.object,
  children: PropTypes.func,
  iconRight: PropTypes.any,
  colorText: PropTypes.string
};

HighlightButton.defaultProps = {
  style: {}
};

export default React.memo(HighlightButton);
