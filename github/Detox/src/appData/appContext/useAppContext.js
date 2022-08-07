import NetInfo from '@react-native-community/netinfo';
import React, {useEffect, useReducer, useRef} from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';

import {TOAST_MESSAGE_TYPE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import ConfirmDialog from '../../components/ConfirmDialog';
import TabPopup from '../../components/TabBar/TabPopup';
import logService from '../../service/logService';
import {getAppLanguage} from '../appSettings/selectors';
import {AppContext, initialState, initUserInfo} from './appContext';

const SHOW_SPINNER = 'SHOW_SPINNER';
const SHOW_CONFIRM_MODAL = 'SHOW_CONFIRM_MODAL';
const UPDATE_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS';
const UPDATE_MASTER_DATA = 'UPDATE_MASTER_DATA';
const UPDATE_UNREAD_NOTI = 'UPDATE_UNREAD_NOTI';
const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
const UPDATE_SUMMARY_NOTI = 'UPDATE_SUMMARY_NOTI';
const RECEIVE_CONTACT_TRADING_B2C_NOTIFICATION = 'RECEIVE_CONTACT_TRADING_B2C_NOTIFICATION';
const READ_CONTACT_TRADING_B2C_NOTIFICATION = 'READ_CONTACT_TRADING_B2C_NOTIFICATION';
const READ_ALL_CONTACT_TRADING_B2C_NOTIFICATION = 'READ_ALL_CONTACT_TRADING_B2C_NOTIFICATION';

const appSpinnerAction = (spinning, text = translate(STRINGS.LOADING)) => {
  return {type: SHOW_SPINNER, payload: {spinning, text}};
};

const appConfirmModalAction = payload => {
  return {type: SHOW_CONFIRM_MODAL, payload: payload};
};

const updateConnectionStatusAction = (isOnline = false) => {
  return {type: UPDATE_CONNECTION_STATUS, payload: isOnline};
};

const updateMasterData = masterData => {
  return {type: UPDATE_MASTER_DATA, payload: masterData};
};

const updateUnReadNoti = count => {
  return {type: UPDATE_UNREAD_NOTI, payload: count};
};

const updateSummaryNoti = count => {
  return {type: UPDATE_SUMMARY_NOTI, payload: count};
};

const updateUserInfoAction = userInfo => {
  return {type: UPDATE_USER_INFO, payload: userInfo};
};

const reducer = (state: typeof initialState, action) => {
  switch (action.type) {
    case SHOW_SPINNER:
      return {...state, appSpinner: action.payload};
    case SHOW_CONFIRM_MODAL:
      return {...state, appModal: action.payload};
    case UPDATE_CONNECTION_STATUS:
      return {...state, isOnline: action.payload};
    case UPDATE_MASTER_DATA:
      return {...state, masterData: action.payload};
    case UPDATE_UNREAD_NOTI:
      return {...state, unReadNotification: action.payload};
    case UPDATE_SUMMARY_NOTI:
      return {...state, summaryNoti: action.payload};
    case UPDATE_USER_INFO:
      return {...state, userInfo: action.payload};

    case RECEIVE_CONTACT_TRADING_B2C_NOTIFICATION:
      return {
        ...state,
        contactTradingB2CNotifications: [
          //format
          action.payload,
          ...state.contactTradingB2CNotifications.slice(0, 2),
        ],
      };
    case READ_CONTACT_TRADING_B2C_NOTIFICATION:
      return {
        ...state,
        contactTradingB2CNotifications: state.contactTradingB2CNotifications.filter(
          value => value.id !== action.payload,
        ),
      };
    case READ_ALL_CONTACT_TRADING_B2C_NOTIFICATION:
      return {
        ...state,
        contactTradingB2CNotifications: [],
      };

    default:
      return state;
  }
};

const useContactTradingNotification = dispatch => {
  const receive = ({id, message}) => {
    dispatch({type: RECEIVE_CONTACT_TRADING_B2C_NOTIFICATION, payload: {id, message}});
  };

  const read = id => {
    if (!id) {
      dispatch({type: READ_ALL_CONTACT_TRADING_B2C_NOTIFICATION});
    } else {
      dispatch({type: READ_CONTACT_TRADING_B2C_NOTIFICATION, payload: id});
    }
  };

  return {receive, read};
};

const AppProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const contactTradingNotification = useContactTradingNotification(dispatch);
  const launchUrlRef = useRef({});
  const isAppLoadedRef = useRef(false);
  const isLoggedInRef = useRef(false);
  const [isShowMenu, showMenu] = React.useState(false);

  const homePageScrollRef = useRef(null);

  const showAppSpinner = (spinning, text) => {
    dispatch(appSpinnerAction(spinning, text));
  };
  const showAppModal = props => {
    dispatch(appConfirmModalAction(props));
  };

  const showToastInfo = ({messageType = TOAST_MESSAGE_TYPE.success, title, message}) => {
    return Toast.show({
      type: messageType,
      visibilityTime: 5000,
      topOffset: 60,
      bottomOffset: 40,
      text1: title,
      text2: message,
    });
  };

  const showErrorAlert = (errorMessage, onOkHandler) => {
    if (!errorMessage) {
      return;
    }
    showAppModal({
      isVisible: true,
      title: translate(STRINGS.DEFAULT_MODAL_TITLE),
      message: errorMessage,
      onOkHandler,
    });
  };
  const showMessageAlert = (titleString, messageString, hotlineNumber = null) => {
    showAppModal({isVisible: true, title: titleString, message: messageString, hotlineNumber});
  };
  const updateConnectionStatus = isOnline => {
    dispatch(updateConnectionStatusAction(isOnline));
  };
  const updateUserInfo = userInfo => {
    dispatch(updateUserInfoAction(userInfo));
  };
  const clearUserInfo = () => {
    dispatch(updateUserInfoAction(initUserInfo));
  };
  const getMasterData = () => {
    return state.masterData;
  };
  const setMasterData = masterData => {
    dispatch(updateMasterData(masterData));
  };
  const setUnreadNoti = count => {
    dispatch(updateUnReadNoti(count));
  };

  const setSummaryNoti = summaryData => {
    dispatch(updateSummaryNoti(summaryData));
  };

  const setIsLoggedIn = isLoggedIn => {
    isLoggedInRef.current = isLoggedIn;
  };
  const getIsLoggedIn = () => {
    return isLoggedInRef.current;
  };

  const setIsAppLoaded = isLoaded => {
    isAppLoadedRef.current = isLoaded;
  };
  const getIsAppLoaded = () => {
    return isAppLoadedRef.current;
  };

  const setHomePageScrollRef = scrollRef => {
    homePageScrollRef.current = scrollRef;
  };

  const scrollHomePageToTop = () => {
    if (homePageScrollRef.current) {
      homePageScrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
    }
  };

  const getLaunchUrl = () => {
    logService.log('getLaunchUrl==', launchUrlRef.current);
    return launchUrlRef.current;
  };
  const setLaunchUrl = (launchUrl, notificationId) => {
    launchUrlRef.current = {launchUrl, notificationId};
    logService.log('setLaunchUrl==', launchUrlRef.current);
  };
  const clearLaunchUrl = () => {
    launchUrlRef.current = {};
    logService.log('clearLaunchUrl==', launchUrlRef.current);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(netState => {
      const {isInternetReachable} = netState;
      if (isInternetReachable !== state.isOnline) {
        updateConnectionStatus(isInternetReachable);
      }
    });
    return function cleanUp() {
      unsubscribe();
    };
  });

  useSelector(getAppLanguage); //this is for changing language dynamically for all components
  let value = {state, showAppSpinner, showAppModal, showMessageAlert, showErrorAlert};
  value = {...value, setUnreadNoti, getMasterData, setMasterData, updateUserInfo, clearUserInfo};
  value = {...value, setIsLoggedIn, getIsLoggedIn, setIsAppLoaded, getIsAppLoaded};
  value = {...value, getLaunchUrl, setLaunchUrl, clearLaunchUrl, showToastInfo};
  value = {
    ...value,
    setSummaryNoti,
    showMenu,
  };
  value = {
    ...value,
    readContactTradingB2CNotification: contactTradingNotification.read,
    receiveContactTradingB2CNotification: contactTradingNotification.receive,
  };
  value = {
    ...value,
    setHomePageScrollRef,
    scrollHomePageToTop,
  };

  const onDismissAppModal = () => {
    showAppModal({isVisible: false});
  };

  return (
    <AppContext.Provider value={value}>
      <SafeAreaProvider>
        <ConfirmDialog {...state?.appModal} onDismiss={onDismissAppModal} />
        <Spinner visible={state?.appSpinner?.spinning} animation="none" />
        {children}
        {isShowMenu && <TabPopup showMenu={showMenu} />}
      </SafeAreaProvider>
    </AppContext.Provider>
  );
};

export {AppContext, AppProvider};
