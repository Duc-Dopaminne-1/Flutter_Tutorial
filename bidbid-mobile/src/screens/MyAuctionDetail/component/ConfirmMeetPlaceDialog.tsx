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
  confirmOnPressed: () => void;
  onPressPlaceMeet: () => void;
}

export default function ConfirmMeetPlaceDialog(props: Props): ReactElement {
  const { auction, isVisible, onBackdropPress = () => {}, confirmOnPressed = () => {}, onPressPlaceMeet = () => {} } = props;

  if (!auction) return null;
  const meetPlace = auction.meetPlace ? auction.meetPlace : { name: '', address: '', lng: '', lat: '' };

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
          <DefaultText {...{ style: styles.textStyle }}>
            {language('confirmAttendanceAt')}
            <DefaultText {...{ style: styles.addressTextStyle }} onPress={onPressPlaceMeet}>
              {' '}
              {meetPlace ? meetPlace?.address?.replace(/(\r\n|\n|\r)/gm, '') : ''}{' '}
            </DefaultText>
            {/* {formatTime(new Date())} */}
          </DefaultText>

          {/* Submit View */}
          <View style={styles.submitView}>
            <Pressable style={styles.okButtonView} onPress={confirmOnPressed}>
              <Text style={styles.okText}>{language('ok')}</Text>
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
    marginVertical: 20,
  } as ViewStyle,

  textStyle: {
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: fonts.size.s14,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  addressTextStyle: {
    color: colors.blue_700,
  } as TextStyle,

  okButtonView: {
    width: '85%',
    height: 50,
    borderRadius: 36,
    backgroundColor: colors.red_700,
    justifyContent: 'center',
  } as ViewStyle,

  okText: {
    textAlign: 'center',
    fontSize: fonts.size.s17,
    color: colors.white,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,
});
