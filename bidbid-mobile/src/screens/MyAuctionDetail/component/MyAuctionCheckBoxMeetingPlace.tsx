import React, { ReactElement, useState } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { Auction, AuctionStatus } from '@/models';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import CustomConfirmModalHaveLink from '@/components/CustomModalHaveLink';
import IconBoxCheckedSVG from '@/components/SVG/IconBoxCheckedSVG';
import IconBoxUnCheckSVG from '@/components/SVG/IconBoxUnCheckSVG';

interface Props {
  title?: string;
  auction?: Auction;
  checkBoxSelected: boolean;
  checkBoxCallback: (selected: boolean) => void;
  isBiddeeAuctionProcess?: boolean;
  namePersonMeet?: string;
}

export function MyAuctionCheckBoxMeetingPlace(props: Props): ReactElement {
  const { title, auction, checkBoxSelected, checkBoxCallback, isBiddeeAuctionProcess = false, namePersonMeet } = props;
  const { user } = useSelector((state: RootState) => {
    return state;
  });
  const [modalVisibleAuctionProcess, setModalVisibleAuctionProcess] = useState(false);
  if (!auction) return null;

  const { biddeeArrived, bidderArrived, status } = auction;

  if (status === AuctionStatus.CANCEL || status === AuctionStatus.COMPLETED || status === AuctionStatus.FAILED_PAYMENT) return null;

  const isBiddee = auction ? auction.creatorId === user.data.id : false;

  if (isBiddee && biddeeArrived) return null;
  if (!isBiddee && bidderArrived) return null;

  const boxView = checkBoxSelected ? IconBoxCheckedSVG : IconBoxUnCheckSVG;

  const boxCheckSelected = () => {
    if (isBiddeeAuctionProcess) {
      setModalVisibleAuctionProcess(true);
      return;
    }
    checkBoxCallback && checkBoxCallback(!checkBoxSelected);
  };

  const onBackdropPressAuctionProcess = () => {
    setModalVisibleAuctionProcess(false);
  };

  return (
    <>
      <Pressable style={styles.container} onPress={boxCheckSelected}>
        <Pressable style={styles.checkBoxWrapper} disabled={true}>
          {boxView}
        </Pressable>
        <Text style={styles.textStyle}>{title || language('confirmMeetPlateDesc')}</Text>
      </Pressable>
      <CustomConfirmModalHaveLink
        title={language('issueProcessing', { name: namePersonMeet })}
        onBackdropPress={onBackdropPressAuctionProcess}
        textButton={language('ok')}
        isVisible={modalVisibleAuctionProcess}
        isButton
        titleStyle={styles.titleStyle}
        onPressOke={onBackdropPressAuctionProcess}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  titleStyle: {
    fontSize: fonts.size.s16,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: fonts.size.s15,
    color: colors.gray_900,
    fontFamily: fonts.family.SSPRegular,
  } as TextStyle,

  checkBoxWrapper: {
    padding: 5,
    marginRight: 5,
    alignItems: 'center',
  } as ViewStyle,
});
