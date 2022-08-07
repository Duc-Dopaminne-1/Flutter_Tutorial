import React, { ReactElement, useMemo } from 'react';
import { TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '@/vars';
import { language } from '@/i18n';
import Modal from 'react-native-modal';
import { RootState } from '@/redux/reducers';
import { useSelector } from 'react-redux';
import DefaultText from '@/components/CustomText/DefaultText';
import { isIOS } from '@/shared/devices';
import NavigationActionsService from '@/navigation/navigation';
import CloseSvg from '@/components/SVG/CloseSVG';
import ImgCongratulationSVG from '@/components/SVG/ImgCongratulationSVG';

const MODAL: ViewStyle = {
  margin: 0,
};

const CONTAINER: ViewStyle = {
  marginHorizontal: 20,
  borderRadius: 10,
  backgroundColor: 'white',
  padding: 10,
};

const WRAPPER_CLOSE_ICON: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'flex-end',
};

const WRAPPER_IMAGE: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
};

const TITLE: TextStyle = {
  fontSize: 16,
  textAlign: 'center',
  fontWeight: isIOS ? '600' : 'bold',
  color: colors.gray_900,
};

const DESCRIPTION: TextStyle = {
  fontSize: 14,
  textAlign: 'center',
  color: colors.gray_700,
  marginTop: 3,
  marginBottom: 10,
  marginHorizontal: 60,
};

interface PlaceABidSuccessAlertProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  isFromHomeDetail?: boolean;
  isAuctionRaffle?: boolean;
}

export function PlaceABidSuccessAlert(props: PlaceABidSuccessAlertProps): ReactElement {
  const { isVisible, onBackdropPress, isAuctionRaffle } = props;
  const placeABid = useSelector((state: RootState) => {
    return state.placeABid;
  });

  const userBidPrice = placeABid?.price ? parseFloat(placeABid?.price?.replace(/,/g, '')) : 0;
  const { endNowPrice } = placeABid.auction;

  const title = useMemo(() => {
    if (isAuctionRaffle) {
      return language('placeABid.successfullyPurchased');
    }
    if (userBidPrice === endNowPrice) {
      return language('placeABid.alertSuccessEndItNowDesc');
    } else {
      return language('placeABid.alertSuccessDesc');
    }
  }, [userBidPrice, endNowPrice, isAuctionRaffle]);

  const descripiton = userBidPrice === endNowPrice || !placeABid.auction.reservePrice ? '' : language('placeABid.alertBidHeighestDesc');

  const onBackdropPressed = () => {
    onBackdropPress();
    if (userBidPrice === endNowPrice && props.isFromHomeDetail) {
      setTimeout(NavigationActionsService.goBack, 1000);
    }
  };

  const closeOnPressed = () => {
    onBackdropPress();
    if (userBidPrice === endNowPrice && props.isFromHomeDetail) {
      setTimeout(NavigationActionsService.goBack, 1000);
    }
  };

  return (
    <Modal onBackdropPress={onBackdropPressed} isVisible={isVisible} style={MODAL}>
      <View style={CONTAINER}>
        <TouchableOpacity style={WRAPPER_CLOSE_ICON} onPress={closeOnPressed}>
          <CloseSvg />
        </TouchableOpacity>

        <View style={WRAPPER_IMAGE}>
          <ImgCongratulationSVG />
        </View>
        <DefaultText {...{ style: TITLE }}>{title}</DefaultText>
        <DefaultText {...{ style: DESCRIPTION }}>{`${descripiton}`}</DefaultText>
      </View>
    </Modal>
  );
}
