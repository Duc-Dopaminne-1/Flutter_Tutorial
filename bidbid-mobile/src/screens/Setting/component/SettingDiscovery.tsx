import { FILTER_GLOBAL, LOAD_PROFILE_DISCOVERY } from '@/constants/app';
import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { ActionDiscoveryPayload } from '@/redux/discovery';
import { getDiscovery } from '@/redux/discovery/actions';
import { filterSelector } from '@/redux/filters/selector';
import SettingTitle from '@/screens/Setting/component/SettingTitle';
import { alertError } from '@/shared/alert';
import React, { ReactElement, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import AgeRangeContainer from './discovery/AgeRangeContainer';
import AuctionStatusContainer from './discovery/AuctionStatusContainer';
import CareerStrengthsContainer from './discovery/CareerStrengthsContainer';
import CategoriesContainer from './discovery/CategoriesContainer';
import GlobalContainer from './discovery/GlobalContainer';
import LanguagesSelectContainer from './discovery/LanguagesSelectContainer';
import LocationContainer from './discovery/LocationContainer';
import SexualOrientationContainer from './discovery/SexualOrientationContainer';
import ShowMeContainer from './discovery/ShowMeContainer';
import ShowMeOnBidbidContainer from './discovery/ShowMeOnBidbidContainer';
import SocialInterestsContainer from './discovery/SocialInterestsContainer';
import { set } from '@/services/storage';
import { userShared } from '@/shared/user';

export function SettingDiscovery(): ReactElement {
  const dispatch = useDispatch();
  const shouldGetDiscovery = useRef<boolean>(false);
  const filters = filterSelector();
  useEffect(() => {
    // the first go to setting, should not update discovery, because the user hasn't updated the settings
    const initData = async () => {
      if (!shouldGetDiscovery.current) {
        setTimeout(() => {
          shouldGetDiscovery.current = true;
        }, 1000);
        return;
      }
      const { lat, lng } = userShared.getLocation();
      let params = {};
      let optionalParams = {};
      const getDiscoveryParams = {
        perPage: LOAD_PROFILE_DISCOVERY,
        isFilter: true,
        filterGlobal: filters.global,
        filterLocation: filters.location,
        instaUsername: filters.instaUsername,
        latitude: lat,
        longitude: lng,
        onFail: onFail,
        onSuccess,
      };

      params = {
        ...getDiscoveryParams,
        ...optionalParams,
        showLoading: true,
      };

      if (filters?.shouldGetDiscovery === false) {
        return;
      }
      await set(FILTER_GLOBAL, `${filters.global}`);
      dispatch(getDiscovery(params as ActionDiscoveryPayload));
    };
    initData().then(_r => {});
  }, [filters]);

  const onFail = (error: string) => {
    NavigationActionsService.hideLoading();
    alertError(error, language('error'), null);
  };

  const onSuccess = _ => {
    NavigationActionsService.hideLoading();
  };

  return (
    <View style={styles.container}>
      <SettingTitle title={language('discoverySettings')} />

      <GlobalContainer />

      <LocationContainer />

      <ShowMeContainer />

      <SexualOrientationContainer />

      <AgeRangeContainer />

      <AuctionStatusContainer />

      <CategoriesContainer />

      <CareerStrengthsContainer />

      <SocialInterestsContainer />

      <LanguagesSelectContainer />

      <ShowMeOnBidbidContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});
