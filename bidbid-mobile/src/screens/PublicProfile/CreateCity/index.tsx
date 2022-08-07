import React, { ReactElement, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors } from '@/vars';
import { language } from '@/i18n';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import { CreateCityItem } from '@/screens/PublicProfile/CreateCity/component/CreateCityItem';
import CustomButton from '@/components/CustomButton';
import { isIphoneX } from '@/shared/devices';
import { Address } from '@/screens/CreateAuction/component/CreateAuctionPlace';
import NavigationActionsService from '@/navigation/navigation';
import { CREATE_LANGUAGE_SCREEN, MAP_SCREEN } from '@/navigation/screenKeys';
import { saveProfile } from '@/redux/createProfile/actions';

export function CreateCityScreen(): ReactElement {
  const [textAddress, setTextAddress] = useState(language('addCity'));
  const addressRef = useRef<any>();
  const [opacity, setOpacity] = useState({ opacity: 0.3 });

  const onSetAddress = (address: Address) => {
    addressRef.current = {
      address: `${address.addressMain}`,
      lat: address.via_Points[0].latitude,
      lng: address.via_Points[0].longitude,
      name: address.state,
      city: address.addressMain,
      country: address.country,
    };
    setTextAddress(address.addressMain);
    setOpacity({ opacity: 1 });
  };

  const saveOnPressed = () => {
    // address empty
    if (textAddress === language('addCity')) {
      return;
    }
    // call api here
    NavigationActionsService.dispatchAction(saveProfile({ city: addressRef.current }));
    NavigationActionsService.push(CREATE_LANGUAGE_SCREEN);
  };

  const onOpenMap = () => {
    NavigationActionsService.push(MAP_SCREEN, {
      isFromCity: true,
      onSetAddress: onSetAddress,
      title: language('editCity'),
      titleButton: language('saveCity'),
    });
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomWrapHeader title={language('whereLive')} />

      <View style={styles.wrapBody}>
        <CreateCityItem textAddress={textAddress} onOpenMap={onOpenMap} />
      </View>

      <CustomButton
        onPress={saveOnPressed}
        containerStyle={[styles.button, opacity]}
        text={language('continue')}
        textStyle={styles.textButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  wrapBody: {
    flex: 1,
    marginTop: 20,
  },
  button: {
    width: null,
    marginBottom: isIphoneX() ? 50 : 30,
    marginTop: 20,
    marginHorizontal: 15,
  },
  textButton: {
    fontWeight: '400',
  },
});
