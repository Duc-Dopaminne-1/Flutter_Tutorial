import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  container: {
    margin: normal,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: 5,
    paddingHorizontal: 24,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    marginRight: 10,
  },
  cancelText: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.PRIMARY_A100,
  },
  okButton: {
    flex: 1,
    color: COLORS.NEUTRAL_WHITE,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  okText: {
    ...FONTS.bold,
    fontSize: normal,
    color: COLORS.NEUTRAL_WHITE,
  },
});

export const BottomButton = ({style, cancelText, okText, onPressCancel, onPressOk}) => {
  return (
    <View style={[styles.container, style]}>
      {cancelText && (
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onPressCancel}>
          <Text style={styles.cancelText}>{cancelText}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={[styles.button, styles.okButton]} onPress={onPressOk}>
        <Text style={styles.okText}>{okText}</Text>
      </TouchableOpacity>
    </View>
  );
};
