import React, { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { MAP_SCREEN } from '@/navigation/screenKeys';
import { FormikValues } from 'formik';
import ErrorMessage from '@/components/ErrorMessage';
import NextSVG from '@/components/SVG/NextSVG';

interface Location {
  latitude: number;
  longitude: number;
}

export interface CreateProfileCity {
  address: string;
  lat: number;
  lng: number;
  name: string;
  city: string;
  country: string;
}

export interface Address {
  state: string;
  addressMain: string;
  country?: string;
  via_Points: Location[];
}

export function CreateAuctionPlace({ setFieldValue, errors, setFieldError }: FormikValues): ReactElement {
  const navigation = useNavigation();
  const [address, setAddress] = useState(language('address'));

  const onSetAddress = (address: Address) => {
    setAddress(address.addressMain.toString());
    setFieldValue('placeMeet', address);
    setFieldError('placeMeet', '');
  };

  const onOpenMap = () => {
    navigation.navigate(MAP_SCREEN, {
      onSetAddress: onSetAddress,
      title: language('addAddressMap'),
      titleButton: language('addAddress'),
    });
  };

  return (
    <View>
      <CustomButton
        onPress={onOpenMap}
        wrapBtn={styles.wrapBtnDuration}
        containerStyle={styles.wrapCtnBtnDuration}
        textStyle={styles.textBtn}
        text={(address && address.replace(/(\r\n|\n|\r)/gm, '')) || ''}
        numberOfLines={1}
        iconSecondStyle={styles.icon}
        iconSecond={<NextSVG />}
      />
      <ErrorMessage errorValue={errors.placeMeet} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapBtnDuration: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  wrapCtnBtnDuration: {
    width: null,
    height: 42,
    borderRadius: 10,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderColor: colors.gray_400,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  textBtn: {
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    letterSpacing: 0,
    marginRight: 10,
    fontWeight: null,
  },
  icon: {
    height: 12,
    width: 12,
  },
});
