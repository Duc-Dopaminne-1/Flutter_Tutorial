import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { Auction, AuctionStatus } from '@/models';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import NavigationActionsService from '@/navigation/navigation';
import { SHOW_QR_CODE_SCREEN, SCAN_QR_CODE_SCREEN, COUNT_DOWN_SCREEN } from '@/navigation/screenKeys';

interface Props {
  auction?: Auction;
}

export const MyAuctionAccessQRCode = (props: Props) => {
  const { auction } = props;
  const { user } = useSelector((state: RootState) => {
    return state;
  });

  const { biddeeArrived, bidderArrived, confirmedAt, status } = auction;
  if (status === AuctionStatus.CANCEL || status === AuctionStatus.COMPLETED) return null;

  const isBiddee = auction ? auction.creatorId === user.data.id : false;

  if (isBiddee && !biddeeArrived) return null;
  if (!isBiddee && !bidderArrived) return null;

  const qrcodeDescription = !isBiddee ? language('accessQRCodeWithBiddee') : language('accessQRCodeWithBidder');

  const onHandleAccess = () => {
    if (confirmedAt) {
      NavigationActionsService.push(COUNT_DOWN_SCREEN, {
        auction,
      });
      return;
    }
    if (!isBiddee) {
      NavigationActionsService.push(SCAN_QR_CODE_SCREEN, {
        auction,
      });
    } else {
      NavigationActionsService.push(SHOW_QR_CODE_SCREEN, {
        auction,
      });
    }
  };

  return (
    <Pressable style={styles.container} onPress={onHandleAccess}>
      <Text style={styles.textTitle}>{qrcodeDescription}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  textTitle: {
    fontSize: fonts.size.s16,
    fontWeight: '400',
    color: colors.blue_700,
    fontFamily: fonts.family.SSPRegular,
    textDecorationLine: 'underline',
  },
});
