import PropTypes from 'prop-types';
import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';

import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {normal, smallNormal} from '../assets/theme/metric';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  dialogStyle: {
    borderRadius: SIZES.BORDER_RADIUS_8,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  contentContainer: {
    maxHeight: 250,
  },
  scrollViewContentContainer: {
    paddingHorizontal: normal,
  },
  textMessage: {
    ...FONTS.regular,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.BLACK_33,
    textAlign: 'center',
  },
  titleStyle: {
    ...FONTS.bold,
    fontSize: 21,
    lineHeight: 31,
    color: COLORS.PRIMARY_A100,
    textAlign: 'center',
  },
  buttonsStyle: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  containerButtonsStyle: {
    marginHorizontal: normal,
    marginBottom: normal,
    flexDirection: 'row',
  },
  commonButton: {
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: SIZES.BORDER_RADIUS_8,
    paddingHorizontal: normal,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  negativeButton: {
    backgroundColor: COLORS.GREY_ED,
  },
  negativeText: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.BLACK_31,
  },
  positiveButton: {
    flex: 1,
    color: COLORS.NEUTRAL_WHITE,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  positiveText: {
    ...FONTS.bold,
    fontSize: normal,
    color: COLORS.NEUTRAL_WHITE,
  },
  separator10: {
    width: smallNormal,
  },
});

export type Props = {
  isVisible: Boolean,
  title?: String,
  titleStyle: Object,
  titleColor: String,
  message: string,
  okText?: string,
  cancelText?: string,
  onOkHandler?: () => {},
  onDismiss?: () => {},
  onCancelHandler?: () => {},
  cancelButtonStyle: Object,
  okButtonStyle: Object,
  children?: PropTypes.element,
};

const CustomDialog = ({
  isVisible,
  title,
  titleStyle,
  message,
  okText,
  cancelText,
  onOkHandler = () => {},
  onDismiss = () => {},
  onCancelHandler = () => {},
  cancelButtonStyle,
  okButtonStyle,
  children,
}: Props) => {
  let positiveText = null;
  if (cancelText) {
    positiveText = okText || translate(STRINGS.OK);
  } else {
    positiveText = okText || translate(STRINGS.CLOSE);
  }

  return (
    <Dialog
      title={title}
      dialogStyle={styles.dialogStyle}
      contentStyle={styles.container}
      titleStyle={[styles.titleStyle, titleStyle]}
      visible={isVisible}
      onTouchOutside={onDismiss}
      buttonsStyle={styles.buttonsStyle}
      buttons={
        <View style={styles.containerButtonsStyle}>
          {cancelText && (
            <TouchableOpacity
              style={[styles.commonButton, styles.negativeButton, cancelButtonStyle]}
              onPress={() => {
                onCancelHandler();
                onDismiss();
              }}>
              <Text style={styles.negativeText}>{cancelText}</Text>
            </TouchableOpacity>
          )}
          {cancelText && <View style={styles.separator10} />}
          <TouchableOpacity
            style={[styles.commonButton, styles.positiveButton, okButtonStyle]}
            onPress={() => {
              onOkHandler();
              onDismiss();
            }}>
            <Text style={styles.positiveText}>{positiveText}</Text>
          </TouchableOpacity>
        </View>
      }>
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          {children}
          {message && <Text style={styles.textMessage}>{message}</Text>}
        </ScrollView>
      </View>
    </Dialog>
  );
};

export default CustomDialog;
