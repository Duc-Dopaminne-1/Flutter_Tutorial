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
}

export default function VerifyPendingRequestDialog(props: Props): ReactElement {
  const { isVisible, onBackdropPress = () => {} } = props;
  return (
    <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={isVisible} style={styles.wrapModal}>
      <View style={styles.container}>
        <View style={styles.wrapperIcon}>
          <IconVerifiedSVG />
        </View>

        <Text style={styles.titleText}>{language('verifyUser.pendingTitle')}</Text>
        <Text style={styles.descText}>{language('verifyUser.pendingDesc')}</Text>

        <View style={styles.buttonArea}>
          <Pressable style={styles.okWrapperView} onPress={onBackdropPress}>
            <Text style={styles.okText}>{language('ok')}</Text>
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
    marginVertical: 8,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: fonts.size.s20,
    color: colors.gray_900,
    fontFamily: fonts.family.SSPSemiBold,
  } as TextStyle,

  descText: {
    textAlign: 'center',
    width: '80%',
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

  okWrapperView: {
    width: '80%',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: colors.red_700,
  } as ViewStyle,

  okText: {
    textAlign: 'center',
    fontSize: fonts.size.s18,
    color: colors.white,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,
});
