// import { useHeaderHeight } from '@react-navigation/stack';
import React from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { SPACING } from '../constants/size';

const ActionKeyboardView = ({ children, style, ...props }) => {
  return (
    <KeyboardAvoidingView
      behavior={'position'}
      style={styles.keyboard}
      {...props}
      // keyboardVerticalOffset={useHeaderHeight()}
    >
      <View style={[styles.container, style]}>{children}</View>
    </KeyboardAvoidingView>
  );
};

export default ActionKeyboardView;

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  container: {
    padding: SPACING.Medium
  }
});
