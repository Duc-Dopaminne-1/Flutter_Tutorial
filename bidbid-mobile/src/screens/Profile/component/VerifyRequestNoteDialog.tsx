import React from 'react';
import { StyleSheet, ViewStyle, View, Text, TextStyle, Pressable, Image } from 'react-native';
import { colors, fonts, images } from '@/vars';
import Modal, { ModalProps } from 'react-native-modal';
import { language } from '@/i18n';
import IconVerifiedSVG from '@/components/SVG/IconVerifiedSVG';

export type VerifyRequestNoteDialogProps = Partial<ModalProps> & {
  onNextButtonPress: () => void;
};

const VerifyRequestNoteDialog: React.FC<VerifyRequestNoteDialogProps> = ({ onNextButtonPress, onBackButtonPress, ...props }) => {
  return (
    <Modal onBackButtonPress={onBackButtonPress} style={styles.wrapModal} {...props}>
      <View style={styles.container}>
        <View style={styles.wrapperIcon}>
          <IconVerifiedSVG />
        </View>
        <Text style={styles.titleText}>{language('verifyUser.noteTitle')}</Text>
        <Image source={images.photoWithPeaceFingers} resizeMode="contain" style={styles.peaceFingersImage} />
        <Pressable style={styles.nextWrapperView} onPress={onNextButtonPress}>
          <Text style={styles.nextText}>{language('verifyUser.gotIt')}</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

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
    width: '85%',
    marginVertical: 5,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: fonts.size.s20,
    color: colors.gray_900,
    fontFamily: fonts.family.SSPSemiBold,
  } as TextStyle,

  peaceFingersImage: {
    width: 140,
    height: 140,
    marginTop: 15,
  },

  nextWrapperView: {
    alignSelf: 'stretch',
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 10,
    height: 50,
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

export default VerifyRequestNoteDialog;
