import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View, Text, Pressable } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import Modal from 'react-native-modal';
import IconCloseSVG from '@/components/SVG/IconCloseSVG';

interface LogoutConfirmDialogProps {
  isVisible: boolean;
  onBackdropPress?: () => void;
  confirmOnPressedCallback?: () => void;
}
export default function LogoutConfirmDialog(props: LogoutConfirmDialogProps): ReactElement {
  const { isVisible, onBackdropPress = () => {}, confirmOnPressedCallback = () => {} } = props;

  const confirmOnPressed = () => {
    onBackdropPress();
    confirmOnPressedCallback && confirmOnPressedCallback();
  };

  return (
    <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={isVisible} style={styles.wrapModal}>
      <View style={styles.container}>
        {/* Top View */}
        <View style={styles.topView}>
          <Pressable style={styles.wrapperCloseIcon} onPress={onBackdropPress}>
            <IconCloseSVG />
          </Pressable>
        </View>

        {/* Content View */}
        <View style={styles.contentView}>
          <Text style={styles.description}>{language('wantLogOut')}</Text>
        </View>

        {/* Bottom View */}
        <View style={styles.bottomView}>
          <Pressable style={styles.cancelWrapperView} onPress={onBackdropPress}>
            <Text style={styles.cancelText}>{language('deleteAccountReasonScreen.cancel')}</Text>
          </Pressable>
          <View style={styles.spaceView}></View>
          <Pressable style={styles.confirmWrapperView} onPress={confirmOnPressed}>
            <Text style={styles.confirmText}>{language('deleteAccountReasonScreen.confirm')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapModal: {
    margin: 0,
    justifyContent: 'center',
  } as ViewStyle,

  container: {
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

  topView: {
    alignItems: 'flex-end',
    backgroundColor: colors.white,
  } as ViewStyle,

  wrapperCloseIcon: {
    padding: 5,
  } as ViewStyle,

  contentView: {
    padding: 2,
    marginVertical: 20,
  } as ViewStyle,

  cancelWrapperView: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: colors.red_600,
  } as ViewStyle,

  confirmWrapperView: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: colors.red_700,
  } as ViewStyle,

  spaceView: {
    width: 10,
  } as ViewStyle,

  description: {
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: fonts.size.s18,
    fontWeight: '700',
    color: colors.gray_900,
    fontFamily: fonts.family.SSPSemiBold,
  } as TextStyle,

  cancelText: {
    textAlign: 'center',
    fontSize: fonts.size.s18,
    color: colors.red_600,
    fontFamily: fonts.family.SSPSemiBold,
  } as TextStyle,

  confirmText: {
    textAlign: 'center',
    fontSize: fonts.size.s18,
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
  } as TextStyle,

  bottomView: {
    padding: 10,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,
});
