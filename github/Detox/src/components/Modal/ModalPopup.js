import PropTypes from 'prop-types';
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  ModalProps,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes,
  ViewStyle,
} from 'react-native';

import {COLORS} from '../../assets/theme/colors';

const styles = StyleSheet.create({
  viewContainer: {
    justifyContent: 'center',
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.BLACK_HALF_OPACITY,
  },
  viewOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
  },
});

export type Props = {
  contentContainerStyle: ViewStyle,
} & ModalProps;

const ModalPopup = ({
  children,
  onPressOutSide,
  presentationStyle = 'overFullScreen',
  transparent = true,
  animationType = 'fade',
  contentContainerStyle,
  avoidKeyboard = false,
  ...props
}: Props) => {
  return (
    <Modal
      presentationStyle={presentationStyle}
      animationType={animationType}
      transparent={transparent}
      {...props}>
      <View style={[styles.viewContainer, contentContainerStyle]}>
        <TouchableWithoutFeedback onPress={onPressOutSide}>
          <View style={styles.viewOverlay} />
        </TouchableWithoutFeedback>
        {avoidKeyboard ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            pointerEvents="box-none">
            {children}
          </KeyboardAvoidingView>
        ) : (
          children
        )}
      </View>
    </Modal>
  );
};

ModalPopup.propTypes = {
  visible: PropTypes.bool,
  onPressOutSide: PropTypes.func,
  presentationStyle: PropTypes.string, // 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen',
  transparent: PropTypes.bool,
  animationType: PropTypes.string, // 'none' | 'slide' | 'fade',
  contentContainerStyle: ViewPropTypes.style,
  avoidKeyboard: PropTypes.bool,
};

ModalPopup.defaultProps = {
  visible: false,
  onPressOutSide: () => {},
  presentationStyle: 'overFullScreen',
  transparent: true,
  animationType: 'fade',
  avoidKeyboard: false,
};

export default ModalPopup;
