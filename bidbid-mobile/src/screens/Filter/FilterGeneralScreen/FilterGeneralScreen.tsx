import { FILTER_GLOBAL, LOAD_PROFILE_DISCOVERY } from '@/constants/app';
import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { ActionDiscoveryPayload } from '@/redux/discovery';
import { getDiscovery } from '@/redux/discovery/actions';
import { resetAllFiltersGeneral } from '@/redux/filters/actions';
import { getFilter } from '@/redux/filters/selector';
import { alertError } from '@/shared/alert';
import { colors } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Keyboard, Pressable, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { FilterBodyView } from '../Commons/FilterBodyView';
import { FilterBottomView } from '../Commons/FilterBottomView';
import { FilterHeaderView } from '../Commons/FilterHeaderView';
import { FilterLineBreak } from '../Commons/FilterLineBreak';
import { BodyView } from './components/BodyView';
import { set } from '@/services/storage';
import { userShared } from '@/shared/user';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ROOT_VIEW: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-end',
};

const BACK_DROP: ViewStyle = {
  flex: 1,
  backgroundColor: colors.transparent,
};

const CONTAINER: ViewStyle = {
  backgroundColor: colors.white,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: 30,
  opacity: 1,
};

export function FilterGeneralScreen(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [disableTouch, setDisableTouch] = useState(false);
  const [opacityView] = useState(new Animated.Value(1));

  useEffect(() => {
    show();
  }, []);

  const show = () => {
    setDisableTouch(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDisableTouch(false);
    });
  };

  const hide = async () => {
    return new Promise(resolve => {
      setDisableTouch(true);
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setDisableTouch(false);
        resolve(true);
      });
    });
  };

  const backdropOnPressed = async () => {
    await headerCloseButton();
  };

  const headerCloseButton = async () => {
    await hide();
    navigation.canGoBack() && navigation.goBack();
  };

  const resetOnPressed = async () => {
    Alert.alert(
      language('filterScreen.resetFitlerConfirmTitle'),
      language('filterScreen.resetFitlerConfirmDesc'),
      [
        {
          text: language('alert.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: language('filterScreen.reset'),
          onPress: () => {
            NavigationActionsService.showLoading();

            dispatch(
              resetAllFiltersGeneral({
                onSuccess: _ => {
                  NavigationActionsService.hideLoading();
                },
                onFail: error => {
                  alert(error);
                  NavigationActionsService.hideLoading();
                },
              }),
            );
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const onFail = (error: string) => {
    NavigationActionsService.hideLoading();
    alertError(error, language('error'), null);
  };

  const onSuccess = async _ => {
    NavigationActionsService.hideLoading();
    await headerCloseButton();
  };

  const applyOnPressed = async () => {
    let params = {};
    let optionalParams = {};
    const filters = getFilter();
    const { lat, lng } = userShared.getLocation();
    const getDiscoveryParams = {
      perPage: LOAD_PROFILE_DISCOVERY,
      isFilter: true,
      filterGlobal: filters.global,
      filterLocation: filters.location,
      instaUsername: filters.instaUsername,
      latitude: lat,
      longitude: lng,
      onFail,
      onSuccess,
    };
    params = {
      ...getDiscoveryParams,
      ...optionalParams,
    };

    NavigationActionsService.showLoading();
    await set(FILTER_GLOBAL, `${filters.global}`);
    dispatch(getDiscovery(params as ActionDiscoveryPayload));
  };

  const opacityViewHandler = (opacity: number) => {
    Animated.timing(opacityView, {
      toValue: opacity,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const pointerEvents = disableTouch ? 'none' : 'auto';

  return (
    <View style={ROOT_VIEW} pointerEvents={pointerEvents}>
      <Pressable style={BACK_DROP} onPress={backdropOnPressed} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Animated.View style={[CONTAINER, { opacity: opacityView }, { transform: [{ translateY: translateY }] }]}>
          <FilterHeaderView
            leftIcon="close"
            title={language('filterScreen.title')}
            closeOnPressed={headerCloseButton}
            resetOnPressed={resetOnPressed}
          />
          <FilterLineBreak />
          <FilterBodyView>
            <BodyView
              onCellPressedCallBack={screenName => {
                navigation.navigate(screenName, {
                  opacityViewHandler: opacityViewHandler,
                });
              }}
            />
          </FilterBodyView>
          <FilterBottomView applyOnPressed={applyOnPressed} title={language('filterScreen.apply')} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}
