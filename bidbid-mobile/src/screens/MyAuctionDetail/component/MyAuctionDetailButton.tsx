import React, { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts, screenWidth } from '@/vars';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import { CANCEL_MEET_SCREEN } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import NavigationActionsService from '@/navigation/navigation';
import { RootState } from '@/redux/reducers';
import { useSelector } from 'react-redux';
import { Auction } from '@/models';
import moment from 'moment';
import CustomConfirmModalHaveLink from '@/components/CustomModalHaveLink';
import { isIphoneX } from '@/shared/devices';
import { getListRoom } from '@/redux/messages/actions';
import ModalChartSVG from '@/components/SVG/ModalChartSVG';

interface Prop {
  roomId: string;
  id: string;
  auctionCreatorId: string;
  auction?: Auction;
  isBiddeeAuctionProcess?: boolean;
  nameBidder?: string;
  onPressChat?: () => void;
}

const OneDay = 24;

export function MyAuctionDetailButton(props: Prop): ReactElement {
  const navigation = useNavigation();
  const { id, auctionCreatorId, auction, isBiddeeAuctionProcess = false, nameBidder, onPressChat } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleAuctionProcess, setModalVisibleAuctionProcess] = useState(false);

  const { user } = useSelector((state: RootState) => {
    return state;
  });

  const isBidde = auction ? auction.creatorId === user.data.id : false;

  const cancelMeetOnPressed = () => {
    if (isBiddeeAuctionProcess) {
      setModalVisibleAuctionProcess(true);
      return;
    }

    navigation.navigate(CANCEL_MEET_SCREEN, { auctionId: id, auctionCreatorId: auctionCreatorId });
  };

  const validatetimeCanChat = (time: Date | string) => {
    if (!time) return '';
    const timeMeet = moment(time).format('MM-DD-YYYY HH:mm');
    const now = moment(new Date()).format('MM-DD-YYYY HH:mm');
    const ms = moment(timeMeet, 'MM-DD-YYYY HH:mm:ss').diff(moment(now, 'MM-DD-YYYY HH:mm:ss'));
    const d = moment.duration(ms);
    const result = Math.floor(d.asHours()) + moment.utc(ms).format(':mm');
    return parseFloat(result) >= OneDay;
  };

  const chatBidderOnPressed = () => {
    if (isBiddeeAuctionProcess) {
      setModalVisibleAuctionProcess(true);
      return;
    }

    if (validatetimeCanChat(auction?.meetDate || '')) {
      setModalVisible(true);
      return;
    }

    NavigationActionsService.dispatchAction(getListRoom({}));
    onPressChat && onPressChat();
  };

  const onBackdropPress = () => {
    setModalVisible(false);
  };

  const onBackdropPressAuctionProcess = () => {
    setModalVisibleAuctionProcess(false);
  };

  return (
    <View style={styles.container}>
      <CustomButton
        containerStyle={styles.wrapCancelMeet}
        textStyle={styles.textCancelMeet}
        text={language('cancelMeetGreet')}
        onPress={cancelMeetOnPressed}
      />
      <CustomButton
        containerStyle={styles.wrapChat}
        textStyle={styles.textChat}
        text={isBidde ? language('chatBidder') : language('chatBiddee')}
        onPress={chatBidderOnPressed}
      />
      <CustomConfirmModalHaveLink
        icon={<ModalChartSVG />}
        iconStyle={styles.iconChat}
        title={language('onlyChat')}
        onBackdropPress={onBackdropPress}
        isVisible={modalVisible}
      />

      <CustomConfirmModalHaveLink
        title={language('issueProcessing', { name: nameBidder })}
        onBackdropPress={onBackdropPressAuctionProcess}
        textButton={language('ok')}
        isVisible={modalVisibleAuctionProcess}
        isButton
        titleStyle={styles.titleStyle}
        onPressOke={onBackdropPressAuctionProcess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: isIphoneX() ? 15 : 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: isIphoneX() ? 30 : 12,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    shadowColor: colors.gray_shadow_beta,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 30,
  },
  iconChat: {
    height: 180,
    width: 180,
  },

  titleStyle: {
    fontSize: fonts.size.s16,
  },
  wrapCancelMeet: {
    width: screenWidth / 2 - 24,
    backgroundColor: colors.white,
    paddingVertical: 11,
  },
  textCancelMeet: {
    fontSize: fonts.size.s14,
    color: colors.red_700,
    fontWeight: null,
    fontFamily: fonts.family.PoppinsRegular,
  },
  textChat: {
    fontSize: fonts.size.s16,
    color: colors.white,
    fontFamily: fonts.family.PoppinsRegular,
  },
  wrapChat: {
    width: screenWidth / 2 - 24,
    paddingVertical: 11,
  },
});
