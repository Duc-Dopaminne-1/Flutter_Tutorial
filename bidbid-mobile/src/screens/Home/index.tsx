import React, { ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppState, InteractionManager, Platform, StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors } from '@/vars';
import HomeHeader from '@/screens/Home/component/HomeHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getDiscovery } from '@/redux/discovery/actions';
import { DiscoveryState } from '@/redux/discovery';
import { LOAD_PROFILE_DISCOVERY } from '@/constants/app';
import { PERMISSIONS, RESULTS, request, openSettings } from 'react-native-permissions';
import { EnableLocationView } from './component/EnableLocationView';
import { notificationService } from '@/shared/notification';
import NavigationActionsService from '@/navigation/navigation';
import { HOME_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { setPermissionLocation } from '@/redux/app/actions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Spinner from '@/components/Spinner';
import { getReviewAndFee, getReviews, onUnavailable } from '@/shared/discovery';
import HomeTutorial from '@/screens/Home/tutorial';
import { getStatusFirstInstall } from '@/redux/app/selector';
import HomeEmpty from '@/screens/Home/component/HomeEmpty';
import { getListDiscovery } from '@/redux/discovery/selector';
import { appVersion } from '@/shared/appVersion';
import LinearGradient from 'react-native-linear-gradient';
import HomeCarousel from '@/screens/Home/component/HomeCarousel';
import { getFilter } from '@/redux/filters/selector';
import branch from 'react-native-branch';
import { getUserId } from '@/redux/user/selector';
import { userShared } from '@/shared/user';
import { TutorialState } from '@/redux/tutorial/reducer';
import { AppInit } from '@/redux/app/reducer';
import { isIOS } from '@/shared/devices';

export function HomeScreen(): ReactElement {
  const dispatch = useDispatch();
  const isLoadFirsTime = useRef(true);
  const isNoThanks = useRef(false);

  const { data: profiles, shouldHideLoading, spinnerCover } = useSelector((state: DiscoveryState) => state.discovery);
  const indexTutorial = useSelector((state: TutorialState) => state.tutorial.index);
  const isFirstInstall = useSelector((state: AppInit) => state.app.setting.IS_FIRST_INSTALL);
  const [isLoading, setLoading] = useState(true);
  const [profilesList, setProfilesList] = useState([]);
  const [isEnableLocation, setEnableLocation] = useState(true);

  useLayoutEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      await notificationService.checkPermission();
    });
  }, []);

  useEffect(() => {
    checkLocationService().then(_data => {});
    AppState.addEventListener('change', handleAppStateChangeHandler);
    return () => {
      AppState.removeEventListener('change', handleAppStateChangeHandler);
    };
  }, []);

  useLayoutEffect(() => {
    async function checkVersionApp() {
      await appVersion.checkVersion();
    }
    checkVersionApp().then(_ => {});
  }, []);

  useEffect(() => {
    const branchSubscribe = branch.subscribe(({ params }) => {
      if (!params?.user_id) {
        return;
      }

      if (params?.user_id === getUserId()) {
        NavigationActionsService.deepLinkTabMyAuction();
        return;
      }
      NavigationActionsService.deepLinkHome(HOME_DETAIL_SCREEN, {
        profileId: params?.user_id,
        isFromShareSocial: true,
      });
    });

    return () => {
      branchSubscribe();
    };
  }, []);

  useEffect(() => {
    if (shouldHideLoading) {
      if (isIOS) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
      setProfilesList(profiles);
    } else {
      setLoading(true);
    }
  }, [profiles, shouldHideLoading]);

  useEffect(() => {
    getRequire();
  }, []);

  const getRequire = () => {
    if (isLoadFirsTime.current) {
      isLoadFirsTime.current = false;
      getReviewAndFee();
    }
  };
  const handleAppStateChangeHandler = nextAppState => {
    if (nextAppState === 'active') {
      checkLocationService().then(_r => {});
      getReviews();
    }
  };

  const fetchData = async () => {
    if (getListDiscovery().length > 0 && !shouldHideLoading && isLoading) {
      getDiscoveries();
    }
  };

  const getDiscoveries = () => {
    dispatch(
      getDiscovery({
        perPage: LOAD_PROFILE_DISCOVERY,
        filterGlobal: getFilter().global,
        instaUsername: getFilter().instaUsername,
        latitude: userShared.getLocation().lat,
        longitude: userShared.getLocation().lng,
        onFail: onFail,
      }),
    );
  };

  const onFail = () => {
    setLoading(false);
  };

  const checkLocationService = async (isFromEnableLocation = false) => {
    if (Platform.OS === 'android') {
      getPermissions(isFromEnableLocation);
    } else {
      await checkAndRequestLocationPermission(isFromEnableLocation);
    }
  };

  const getPermissions = (isFromEnableLocation: boolean) => {
    if (!isNoThanks.current) {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
        .then(async _data => {
          isNoThanks.current = true;
          setTimeout(() => {
            isNoThanks.current = false;
          }, 1500);

          await checkAndRequestLocationPermission(isFromEnableLocation);
        })
        .catch(_err => {
          setLoading(false);
          isNoThanks.current = true;
          blocked();
          setTimeout(() => {
            isNoThanks.current = false;
          }, 500);
        });
    }
  };

  const blocked = () => {
    setLoading(false);
    setEnableLocation(false);
    setProfilesList([]);
    dispatch(setPermissionLocation(false));
  };

  const checkAndRequestLocationPermission = async (isFromEnableLocation = false) => {
    let requestResult = await request(
      Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );

    if (requestResult == RESULTS.UNAVAILABLE) {
      blocked();
      setTimeout(() => {
        onUnavailable();
      }, 400);
    } else if (requestResult == RESULTS.DENIED) {
      blocked();
    } else if (requestResult == RESULTS.BLOCKED) {
      if (isFromEnableLocation) {
        openSettings();
      } else {
        blocked();
      }
    } else {
      setEnableLocation(true);
      dispatch(setPermissionLocation(true));
      userShared
        .localCurrentPosition(() => {
          fetchData();
        })
        .then(() => {});
    }
  };

  const renderHome = () => {
    if (isEnableLocation) {
      if (isFirstInstall) {
        return <HomeTutorial />;
      }
      if (profilesList.length === 0 && !isLoading) {
        return <HomeEmpty />;
      }
      return <HomeCarousel />;
    } else {
      return <EnableLocationView onPress={checkLocationService} />;
    }
  };

  const renderBody = () => {
    if (isLoading) return null;

    return (
      <>
        {isEnableLocation && <HomeHeader />}
        {renderHome()}
      </>
    );
  };

  const renderContainer = () => {
    return (
      <>
        <SafeArea />
        <Spinner loading={isLoading} coverScreen={spinnerCover} />
        {renderBody()}
      </>
    );
  };

  if (isEnableLocation && getStatusFirstInstall() && indexTutorial === 0)
    return (
      <LinearGradient locations={[0.5, 1, 1, 1]} style={styles.container} colors={[colors.purple, colors.purple_85]}>
        {renderContainer()}
      </LinearGradient>
    );

  return <View style={styles.container}>{renderContainer()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    zIndex: 1,
  },
});
