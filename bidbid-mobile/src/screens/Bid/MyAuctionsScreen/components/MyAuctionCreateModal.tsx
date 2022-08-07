import React, { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import IconCloseSVG from '@/components/SVG/IconCloseSVG';

interface Props {
  onPressLink?: () => void;
  onBackdropPress?: () => void;
  isFromPlaceABid?: boolean;
}

function MyAuctionCreateModal(props: Props): ReactElement {
  const { onBackdropPress, onPressLink, isFromPlaceABid = false } = props;
  return (
    <View style={styles.containerModal}>
      {/* Top View */}
      <Pressable style={styles.wrapperCloseIcon} onPress={onBackdropPress}>
        <IconCloseSVG height={20} width={20} />
      </Pressable>

      {/* Content View */}
      <Text style={styles.textTitle}>{language('alert.notice')}</Text>
      <View style={styles.wrapNote}>
        <Text style={styles.textNote}>
          {`${language('aPaymentAccount')} `}
          <Text onPress={onPressLink} style={styles.textLink}>
            {`${language('paymentSettings')}`}
          </Text>
          {` ${language(isFromPlaceABid ? 'aPaymentAccountNotePlaceBid' : 'aPaymentAccountNote')}`}
        </Text>
      </View>

      {/* Bottom View */}
      <View style={styles.bottomView}>
        <Pressable style={styles.confirmWrapperView} onPress={onBackdropPress}>
          <Text style={styles.confirmText}>{language('ok')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default React.memo(MyAuctionCreateModal);

const styles = StyleSheet.create({
  containerModal: {
    paddingHorizontal: 0,
    paddingBottom: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

  wrapperCloseIcon: {
    alignItems: 'flex-end',
    paddingTop: 16,
    paddingRight: 21,
    alignSelf: 'flex-end',
  } as ViewStyle,

  confirmWrapperView: {
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: colors.red_700,
    paddingVertical: 14,
    paddingHorizontal: 58,
  } as ViewStyle,

  confirmText: {
    textAlign: 'center',
    fontSize: fonts.size.s16,
    color: colors.white,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,

  bottomView: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,

  textNote: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.gray_900,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsRegular,
  },
  textTitle: {
    marginTop: 5,
    fontFamily: fonts.family.PoppinsBold,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    textAlign: 'center',
  },
  wrapNote: {
    paddingHorizontal: 25,
  },
  textLink: {
    textDecorationLine: 'underline',
    color: colors.blue_text,
    fontSize: fonts.size.s14,
  },
});
