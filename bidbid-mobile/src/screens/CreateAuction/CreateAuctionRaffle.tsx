import React, { ReactElement, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import AlertBanner from '@/components/AlertBanner';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import NavigationActionsService from '@/navigation/navigation';
import { resetValueCharity } from '@/screens/ChooseCharity';
import { mapService } from '@/shared/Map';
import { requestCharity } from '@/shared/global';
import { getDurations } from '@/redux/auction/actions';
import IconBack from '@/components/SVG/BackSvg';
import { BID_SCREEN, CREATE_AUCTION_NORMAL_SCREEN } from '@/navigation/screenKeys';
import { CreateAuctionRaffleFormik } from '@/screens/CreateAuction/component/CreateAuctionRaffleFormik';
import CreateAuctionTitleOption from '@/screens/CreateAuction/component/CreateAuctionTitleOption';
import { userShared } from '@/shared/user';

export function CreateAuctionRaffleScreen(): ReactElement {
  useEffect(() => {
    const { lat, lng } = userShared.getLocation();
    mapService.getCoffeePlace(lat, lng);
  }, []);

  useEffect(() => {
    NavigationActionsService.dispatchAction(getDurations({}));
  }, []);

  const goBack = () => {
    resetValueCharity();
    NavigationActionsService.goBack();
    NavigationActionsService.goBack();
  };

  const onPressBack = () => {
    NavigationActionsService.push(CREATE_AUCTION_NORMAL_SCREEN);
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <AlertBanner message={language('requestCharitySuccess')} subject={requestCharity} />
      <CustomHeader leftIcon={<IconBack />} goBack={goBack} title={language('addAuction')} titleStyle={styles.textTitle} />
      <CreateAuctionTitleOption title={language('backNormal')} onPress={onPressBack} />
      <CreateAuctionRaffleFormik />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textTitle: {
    color: colors.title_grey,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsBold,
  },
});
