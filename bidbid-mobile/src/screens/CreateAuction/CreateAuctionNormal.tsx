import React, { ReactElement, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import AlertBanner from '@/components/AlertBanner';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { CreateAuctionForMik } from '@/screens/CreateAuction/component/CreateAuctionFormik';
import NavigationActionsService from '@/navigation/navigation';
import { resetValueCharity } from '@/screens/ChooseCharity';
import { mapService } from '@/shared/Map';
import { requestCharity } from '@/shared/global';
import { getDurations } from '@/redux/auction/actions';
import IconBack from '@/components/SVG/BackSvg';
import CreateAuctionOptionModal from '@/screens/CreateAuction/component/CreateAuctionOptionModal';
import { userShared } from '@/shared/user';

export function CreateAuctionNormalScreen(): ReactElement {
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
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <AlertBanner message={language('requestCharitySuccess')} subject={requestCharity} />
      <CustomHeader leftIcon={<IconBack />} goBack={goBack} title={language('addAuction')} titleStyle={styles.textTitle} />
      <CreateAuctionOptionModal />
      <CreateAuctionForMik />
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
