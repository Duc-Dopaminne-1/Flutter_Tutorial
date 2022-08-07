import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {AppContext} from '../../appData/appContext/useAppContext';
import * as userActions from '../../appData/user/actions';
import {getUserId, isFirstLogin, isMember} from '../../appData/user/selectors';
import {PAGE_CHILD_TYPE, PAGE_TYPE, SEARCH_TYPE_INDEX} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {commonStyles} from '../../assets/theme/styles';
import SafeAreaScreenContainer from '../../components/SafeAreaScreenContainer';
import usePlusServices from '../../hooks/usePlusServices';
import logService from '../../service/logService';
import UrlUtils from '../../utils/UrlUtils';
import {useLogin} from '../Auth/useLogin';
import {useMountInteraction} from '../commonHooks';
import useGetUnReadNotification from '../Notification/useGetUnReadNotification';
import ScreenIds from '../ScreenIds';
import {handleUrl} from '../WithDeepLinking';
import {ClickLocation, TrackingActions} from '../WithSegment';
import HomeContainer from './HomeContainer';
import {BINH_DINH_ID} from './HomeUtil';
import {useUpdateUserLoginHistory} from './useUserLoginHistoryActions';

const getWorkingArea = item => {
  if (item.cityId === BINH_DINH_ID) {
    return {
      city: {
        id: item.cityId,
        name: translate(STRINGS.BD),
      },
      districts: [{checked: true, id: item.districtId, name: translate(STRINGS.QN)}],
      id: 1,
    };
  }

  const workingArea = {
    city: {
      id: item.cityId,
      name: item.cityName,
    },
    districts: [],
    id: 1,
  };

  return workingArea;
};

const HomeScreen = ({navigation}) => {
  const {track} = useAnalytics();
  const [keyword, setKeyword] = useState('');
  const {getLaunchUrl, clearLaunchUrl} = useContext(AppContext);
  const firstLogin = useSelector(isFirstLogin);
  const isMemberUser = useSelector(isMember);
  const dispatch = useDispatch();
  const userId = useSelector(getUserId);
  const {notLoggedIn, showLogin} = useLogin();

  const {onPressItem: onPressServiceItem, plusServices} = usePlusServices();
  const {markUnReadNotification, getUnReadNotification} = useGetUnReadNotification();
  const onFinishUpdateLoginHistory = () => {
    //ignore success
    logService.log('onFinishUpdateLoginHistory');
  };
  const onErrorUpdateLoginHistory = error => {
    logService.log('onErrorUpdateLoginHistory', error);
  };
  const {startUpdateUserLoginHistory} = useUpdateUserLoginHistory({
    onSuccess: onFinishUpdateLoginHistory,
    onError: onErrorUpdateLoginHistory,
  });

  const onPressRegister = () => {
    navigation.navigate(ScreenIds.AuthStack, {
      screen: ScreenIds.InputMobile,
    });
  };

  useMountInteraction(() => {
    const {launchUrl, notificationId} = getLaunchUrl();
    if (launchUrl) {
      dispatch(userActions.setFirstLogin(false)); // to not show welcome
      const evaluatedUrl = UrlUtils.getAbsoluteUrl(launchUrl);
      if (notLoggedIn) {
        showLogin(() => {
          clearLaunchUrl();
          handleUrl(evaluatedUrl);
        });
        return;
      }
      handleUrl(evaluatedUrl);
      if (notificationId) {
        markUnReadNotification(notificationId);
      }
    }
    if (!notLoggedIn) {
      getUnReadNotification();
    }
  });

  useEffect(() => {
    const {launchUrl} = getLaunchUrl();
    if (firstLogin && isMemberUser && !launchUrl) {
      dispatch(userActions.setFirstLogin(false));
      startUpdateUserLoginHistory(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLogin, isMemberUser]);

  const openSearchB2C = () => {
    track(TrackingActions.projectButtonClicked, {
      click_location: ClickLocation.home,
    });

    navigation.navigate(ScreenIds.Search, {
      tabIndex: SEARCH_TYPE_INDEX.B2C,
      keyword: keyword,
    });
    setKeyword('');
  };

  const openSearchC2C = () => {
    track(TrackingActions.buyButtonClicked, {
      click_location: ClickLocation.home,
    });

    navigation.navigate(ScreenIds.Search, {
      tabIndex: SEARCH_TYPE_INDEX.C2C,
      keyword: keyword,
    });
    setKeyword('');
  };

  const openSearchAgent = () => {
    track(TrackingActions.agentButtonClicked, {
      click_location: ClickLocation.home,
    });

    navigation.navigate(ScreenIds.Search, {
      tabIndex: SEARCH_TYPE_INDEX.AGENT,
      keyword: keyword,
    });
    setKeyword('');
  };

  const openService = () => {
    track(TrackingActions.serviceButtonClicked, {
      click_location: ClickLocation.home,
    });

    navigation.navigate(ScreenIds.PlusService);
  };

  const onUtilities360 = () => {
    navigation.navigate(ScreenIds.Utilities360);
  };

  const onSearch = () => {
    navigation.navigate(ScreenIds.SearchSuggest);
  };

  const onRequestBuy = () => {
    openSearchC2C();
  };

  const onPressArea = item => {
    const workingArea = getWorkingArea(item);
    navigation.navigate(ScreenIds.Search, {
      tabIndex: SEARCH_TYPE_INDEX.C2C,
      placeJson: [workingArea],
    });
  };

  const onViewMoreProject = () => {
    navigation.navigate(ScreenIds.Search, {tabIndex: SEARCH_TYPE_INDEX.B2C});
  };

  const onViewMoreProperty = () => {
    openSearchC2C();
  };

  const onNews = () => {
    navigation.navigate(ScreenIds.NewList);
  };

  const onPressViewKnowledge = () => {
    navigation.navigate(ScreenIds.PageDetailQuery, {
      query: {
        pageType: PAGE_CHILD_TYPE.TRAINING_PAGE,
        objectType: PAGE_TYPE.INTRODUCTION,
      },
      isStatic: false,
      title: translate(STRINGS.TRAINING),
    });
  };

  return (
    <SafeAreaScreenContainer style={commonStyles.whiteBackground} testID={ScreenIds.Home}>
      <HomeContainer
        onSearch={onSearch}
        onPressRegister={onPressRegister}
        onPressServiceItem={onPressServiceItem}
        openSearchB2C={openSearchB2C}
        openSearchC2C={openSearchC2C}
        openSearchAgent={openSearchAgent}
        openService={openService}
        onUtilities360={onUtilities360}
        onNews={onNews}
        onKnowledge={onPressViewKnowledge}
        onRequestBuy={onRequestBuy}
        onPressArea={onPressArea}
        onViewMoreProject={onViewMoreProject}
        onViewMoreProperty={onViewMoreProperty}
        onPressViewMoreKnowledge={onPressViewKnowledge}
        keyword={keyword}
        setKeyword={setKeyword}
        plusServices={plusServices}
      />
    </SafeAreaScreenContainer>
  );
};

export default HomeScreen;
