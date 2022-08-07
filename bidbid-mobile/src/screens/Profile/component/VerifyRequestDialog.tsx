import React, { ReactElement } from 'react';
import { StyleSheet, ViewStyle, View, Text, TextStyle, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import Modal from 'react-native-modal';
import { language } from '@/i18n';
import IconVerifiedSVG from '@/components/SVG/IconVerifiedSVG';

interface Props {
  isVisible: boolean;
  onBackdropPress?: () => void;
  confirmOnPressedCallback?: () => void;
  nextButtonOnPressed: () => void;
  onModalHide: () => void;
}

export default function VerifyRequestDialog(props: Props): ReactElement {
  const { isVisible, onBackdropPress = () => {}, nextButtonOnPressed = () => {}, onModalHide = () => {} } = props;
  return (
    <Modal
      onModalHide={onModalHide}
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackdropPress}
      isVisible={isVisible}
      style={styles.wrapModal}
    >
      <View style={styles.container}>
        <View style={styles.wrapperIcon}>
          <IconVerifiedSVG />
        </View>

        <Text style={styles.titleText}>{language('verifyUser.title')}</Text>
        <Text style={styles.descText}>{language('verifyUser.desc')}</Text>

        <View style={styles.buttonArea}>
          <Pressable style={styles.maybeLaterWrapperView} onPress={onBackdropPress}>
            <Text style={styles.maybeLaterText}>{language('verifyUser.maybeLater')}</Text>
          </Pressable>
          <View style={styles.spaceView} />
          <Pressable style={styles.nextWrapperView} onPress={nextButtonOnPressed}>
            <Text style={styles.nextText}>{language('verifyUser.next')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.white,
  } as ViewStyle,

  wrapModal: {
    margin: 0,
  } as ViewStyle,

  wrapperIcon: {
    marginVertical: 5,
  } as ViewStyle,

  titleText: {
    marginVertical: 5,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: fonts.size.s20,
    color: colors.gray_900,
    fontFamily: fonts.family.SSPSemiBold,
  } as TextStyle,

  descText: {
    textAlign: 'center',
    width: '75%',
    fontSize: fonts.size.s18,
    color: colors.gray_900,
    fontFamily: fonts.family.SSPRegular,
  } as TextStyle,

  buttonArea: {
    marginTop: 15,
    padding: 10,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,

  maybeLaterWrapperView: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: colors.gray_400,
  } as ViewStyle,

  spaceView: {
    width: 10,
  } as ViewStyle,

  maybeLaterText: {
    textAlign: 'center',
    fontSize: fonts.size.s18,
    color: colors.gray_500,
    fontFamily: fonts.family.SSPSemiBold,
  } as TextStyle,

  nextWrapperView: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: colors.red_700,
  } as ViewStyle,

  nextText: {
    textAlign: 'center',
    fontSize: fonts.size.s18,
    fontWeight: '700',
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
  } as TextStyle,
});
