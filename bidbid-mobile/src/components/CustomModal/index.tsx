import React, { ReactElement } from 'react';
import { StyleSheet, View, ViewStyle, Text, TextStyle, TouchableOpacity, Pressable } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import Modal from 'react-native-modal';
import IconCloseSVG from '@/components/SVG/IconCloseSVG';

interface CancelMeetConfirmModalProps {
  isVisible: boolean;
  onBackdropPress?: () => void;
  onConfirmPress?: () => void;
  title?: string;
  textBtnConfirm?: string;
  textBtnCancel?: string;
  subTitle?: string;
  isBlockPressOut?: boolean;
  titleStyle?: TextStyle;
}

export default function CustomConfirmModal(props: CancelMeetConfirmModalProps): ReactElement {
  const {
    isVisible,
    onBackdropPress,
    onConfirmPress,
    title,
    textBtnConfirm,
    textBtnCancel = language('cancelMeetScreen.cancel'),
    subTitle,
    isBlockPressOut,
    titleStyle,
  } = props;

  const onPressOut = () => {
    if (isBlockPressOut) {
      return;
    }
    onBackdropPress && onBackdropPress();
  };

  const onPressIconBack = () => {
    if (isBlockPressOut) {
      onConfirmPress && onConfirmPress();
      return;
    }
    onBackdropPress && onBackdropPress();
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onPressOut}>
      <View style={styles.container}>
        <Pressable style={styles.close} onPress={onPressIconBack}>
          <IconCloseSVG />
        </Pressable>

        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.cancelButtonStyle} onPress={onBackdropPress}>
            <Text style={styles.cancelTextStyle}>{textBtnCancel}</Text>
          </TouchableOpacity>

          <View style={styles.spaceView} />

          <TouchableOpacity style={styles.confirmButtonStyle} onPress={onConfirmPress}>
            <Text style={styles.confirmTextStyle}>{textBtnConfirm}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingBottom: 40,
    paddingTop: 50,
    borderRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

  buttonArea: {
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 24,
  } as ViewStyle,

  cancelButtonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderColor: colors.red_600,
    borderWidth: 1,
    borderRadius: 36,
    paddingVertical: 13,
  } as ViewStyle,

  cancelTextStyle: {
    color: colors.red_600,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  close: {
    position: 'absolute',
    right: 21,
    top: 16,
  },

  title: {
    marginHorizontal: 15,
    color: colors.gray_last_time,
    lineHeight: 26,
    fontSize: fonts.size.s16,
    textAlign: 'center',
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,

  confirmButtonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: colors.red_700,
  } as ViewStyle,

  confirmTextStyle: {
    color: colors.white,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,

  spaceView: {
    width: 10,
  },
  subTitle: {
    marginHorizontal: 15,
    color: colors.gray_900,
    fontSize: fonts.size.s14,
    textAlign: 'center',
    fontFamily: fonts.family.RobotoRegulars,
    marginTop: 10,
  },
});
