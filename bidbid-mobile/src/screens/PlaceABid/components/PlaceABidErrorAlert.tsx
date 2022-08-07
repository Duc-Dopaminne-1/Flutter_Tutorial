import React, { ReactElement } from 'react';
import { TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '@/vars';
import { language } from '@/i18n';
import Modal from 'react-native-modal';
import DefaultText from '@/components/CustomText/DefaultText';
import CustomButton from '@/components/CustomButton';
import { isIOS } from '@/shared/devices';
import CloseSvg from '@/components/SVG/CloseSVG';
import ImgBrokenSVG from '@/components/SVG/ImgBrokenSVG';

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
};

const DESCRIPTION: TextStyle = {
  fontSize: 16,
  textAlign: 'center',
  fontWeight: isIOS ? '600' : 'bold',
  color: colors.gray_900,
  marginHorizontal: 10,
  marginTop: 10,
};

const BUTTON: ViewStyle = {
  marginHorizontal: 15,
  marginVertical: 25,
  alignSelf: 'center',
};

interface PlaceABidErrorAlertProps {
  isVisible: boolean;
  onBackdropPressed: () => void;
  tryAgainOnPressed: () => void;
}

export function PlaceABidErrorAlert(props: PlaceABidErrorAlertProps): ReactElement {
  const { isVisible, onBackdropPressed, tryAgainOnPressed } = props;

  return (
    <Modal onBackdropPress={onBackdropPressed} isVisible={isVisible} style={MODAL}>
      <View style={CONTAINER}>
        <TouchableOpacity style={WRAPPER_CLOSE_ICON} onPress={onBackdropPressed}>
          <CloseSvg />
        </TouchableOpacity>

        <View style={WRAPPER_IMAGE}>
          <ImgBrokenSVG />
        </View>

        <DefaultText {...{ style: DESCRIPTION }}>{language('placeABid.alertErrorDesc')}</DefaultText>

        <CustomButton onPress={tryAgainOnPressed} containerStyle={BUTTON} text={language('placeABid.tryAgain')} />
      </View>
    </Modal>
  );
}
