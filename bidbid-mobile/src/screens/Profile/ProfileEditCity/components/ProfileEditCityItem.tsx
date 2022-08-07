import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import { MAP_SCREEN } from '@/navigation/screenKeys';
import { Address } from '@/screens/CreateAuction/component/CreateAuctionPlace';
import { language } from '@/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { createCity } from '@/redux/user/actions';
import { UserInit } from '@/redux/user/reducer';
import DefaultText from '@/components/CustomText/DefaultText';
import LocationSVG from '@/components/SVG/LocationSVG';
import EditLineSVG from '@/components/SVG/EditLineSVG';

export function ProfileEditCityItem(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [textAddress, setTextAddress] = useState(language('empty'));
  const result = useSelector((state: UserInit) => state.user.data.city);
  const city = result ? result : { address: '', id: 0, name: '' };

  const { address } = city;
  useEffect(() => {
    setTextAddress(address);
  }, [address]);

  const onSetAddress = (address: Address) => {
    setTextAddress(address.addressMain);
    dispatch(
      createCity({
        address: `${address.addressMain}`,
        lat: address.via_Points[0].latitude,
        lng: address.via_Points[0].longitude,
        name: address.state,
        city: address.addressMain,
        country: address.country,
      }),
    );
  };

  const onOpenMap = () => {
    navigation.navigate(MAP_SCREEN, {
      isFromCity: true,
      onSetAddress: onSetAddress,
      title: language('editCity'),
      titleButton: language('saveCity'),
    });
  };

  return (
    <Pressable onPress={onOpenMap} style={styles.container}>
      <LocationSVG />
      <View style={styles.wrapAddress}>
        <DefaultText {...{ style: styles.textAddress }}>{textAddress === '' ? language('empty') : textAddress}</DefaultText>
      </View>
      <EditLineSVG />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray_100,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 15,
  },
  textAddress: {
    flexShrink: 1,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
  },
  wrapAddress: {
    flex: 1,
    marginLeft: 12,
    marginRight: 5,
  },
});
