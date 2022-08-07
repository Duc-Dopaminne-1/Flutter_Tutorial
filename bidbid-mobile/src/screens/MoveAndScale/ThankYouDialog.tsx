import React, { ReactElement } from 'react';
import { StyleSheet, ViewStyle, View, Text, TextStyle, Pressable } from 'react-native';
import { colors, fonts, screenWidth } from '@/vars';
import Modal from 'react-native-modal';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import IconCloseSVG from '@/components/SVG/IconCloseSVG';
import IconVerifiedSVG from '@/components/SVG/IconVerifiedSVG';

interface Props {
  isVisible: boolean;
  onBackdropPress?: () => void;
  closeOnPressed: () => void;
}

export default function ThankYouDialog(props: Props): ReactElement {
  const { isVisible, onBackdropPress = () => {}, closeOnPressed = () => {} } = props;

  return (
    <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={isVisible} style={styles.wrapModal}>
      <View style={styles.container}>
        <Pressable style={styles.wrapperIconCloseView} onPress={closeOnPressed}>
          <IconCloseSVG />
        </Pressable>

        <View style={styles.wrapperTickIcon}>
          <IconVerifiedSVG />
        </View>
        <Text style={styles.titleText}>{language('moveAndScaleScreen.thankYou')}</Text>
        <Text style={styles.descText}>{language('moveAndScaleScreen.thankYouDesc')}</Text>

        <CustomButton
          containerStyle={styles.wrapCancelMeet}
          textStyle={styles.textCancelMeet}
          text={language('global.ok')}
          onPress={closeOnPressed}
        />
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

  wrapperIconCloseView: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  } as ViewStyle,

  wrapModal: {
    margin: 0,
  } as ViewStyle,

  wrapperTickIcon: {
    marginTop: 30,
    marginBottom: 5,
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
    marginBottom: 15,
    textAlign: 'center',
    width: '75%',
    fontSize: fonts.size.s18,
    color: colors.gray_900,
    fontFamily: fonts.family.SSPRegular,
  } as TextStyle,

  wrapCancelMeet: {
    width: screenWidth / 2 - 24,
    marginVertical: 10,
  },
  textCancelMeet: {
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsRegular,
  },
});
