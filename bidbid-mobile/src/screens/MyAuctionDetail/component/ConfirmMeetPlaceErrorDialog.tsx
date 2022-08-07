import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View, Text, Pressable } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import Modal from 'react-native-modal';
import DefaultText from '@/components/CustomText/DefaultText';
import { Auction } from '@/models';
import IconCloseSVG from '@/components/SVG/IconCloseSVG';

interface Props {
  isVisible: boolean;
  onBackdropPress?: () => void;
  auction?: Auction;
}

export default function ConfirmMeetPlaceErrorDialog(props: Props): ReactElement {
  const { isVisible, onBackdropPress = () => {} } = props;

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
          {/* Title */}
          <DefaultText {...{ style: styles.title }}>{language('alert.notice')}</DefaultText>
          {/* Description */}
          <DefaultText {...{ style: styles.textStyle }}>{language('confirmMeetPlaceErroDesc')}</DefaultText>

          {/* Submit View */}
          <View style={styles.submitView}>
            <Pressable style={styles.pauseMyAccountButtonView} onPress={onBackdropPress}>
              <Text style={styles.submitText}>{language('ok')}</Text>
            </Pressable>
          </View>
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
  submitView: {
    padding: 2,
    marginVertical: 20,
    alignItems: 'center',
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
    marginVertical: 10,
  } as ViewStyle,

  title: {
    marginHorizontal: 10,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: fonts.size.s20,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,

  textStyle: {
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: fonts.size.s14,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,
  pauseMyAccountButtonView: {
    width: '85%',
    height: 50,
    borderRadius: 36,
    backgroundColor: colors.red_700,
    justifyContent: 'center',
  } as ViewStyle,

  submitText: {
    textAlign: 'center',
    fontSize: fonts.size.s17,
    color: colors.white,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,
});
