import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TpfSdkClient } from '../../../index';
import Proxy from '../../client/internal_proxy';
import { CUSTOM_COLOR } from '../../constants/colors';
import SCREENS_NAME from '../../constants/screens';
import {
  checkMemberTopenerByTopenIdHandle,
  getTopenIdHandle,
  logOutHandle,
  setAccessToken
} from '../../redux/actions/auth';
import { getMasterDataHandle } from '../../redux/actions/masterData';
import {
  createMemberFromSDKHandle,
  createTPFMemberFromSDKHandle,
  getProfileHandle
} from '../../redux/actions/member';
import { setAccountTopenId, toggleSdkState } from '../../redux/actions/middleware';
import { getPartnerListHandle } from '../../redux/actions/partner';
import { getToggleFeatureHandle } from '../../redux/actions/toggleFeature';
import { store } from '../../redux/store/configureStore';
import { LEGAL_TYPE, ONBOARDING_FLOW } from '../../global/legal_type';
import { getShowAlertError } from '../../redux/actions/system';
import { REQUIRE_LOGIN } from '../../constants/errors';
import { translate as t } from '../../i18n';
import { AppLoading } from '../../components';
import { formatToUtcReq } from '../../helpers/formatTime';
import { parseGenders } from '../../redux/parses/gender';

export const DEFAULT_DOB = '19/06/1983';

const MiddleWare = () => {
  const [event, setEvent] = useState({});
  const sdkState = useSelector(state => state.middleware.state);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const memberId = useSelector(state => state.auth.memberId);
  const accessToken = useSelector(state => state.auth.accessToken);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (memberId) {
      dispatch(getProfileHandle({ memberId: memberId }));
    }
  }, [memberId]);

  useEffect(() => {
    if (accessToken) {
      dispatch(getPartnerListHandle());
      dispatch(getToggleFeatureHandle());
      dispatch(getMasterDataHandle());
    }
  }, [accessToken]);

  useEffect(() => {
    if (sdkState == 'show') {
      dispatch(getToggleFeatureHandle());
    }
  }, [sdkState]);

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      if (sdkState === 'show') {
        hideSdk();
      }
    });
    return () => {
      focusListener();
    };
  }, [sdkState]);

  const connect = async data => {
    if (!data?.token) {
      TpfSdkClient?.eventHandlers?.onFailWithError({
        error: true,
        code: 'required_access',
        message: 'Please input Token'
      });
      return;
    }

    if (!data?.user?.last_name || !data?.user?.first_name || !data?.user?.phone) {
      TpfSdkClient?.eventHandlers?.onFailWithError({
        error: true,
        code: 'required_info',
        message: 'Please input phone, last_name, first_name'
      });
      return;
    }
    dispatch(setAccessToken({ accessToken: data.token }));
    dispatch(setAccountTopenId(data.user));
    TpfSdkClient?.eventHandlers?.onConnect({});
  };

  const disConnect = () => {
    dispatch(logOutHandle());
    hideSdk();
  };

  const requestLogin = (routeName, params, callBack, failure) => {
    let flow = '';
    switch (routeName) {
      case SCREENS_NAME.SCAN_INFO_CREDIT_SCREEN:
      case SCREENS_NAME.INSURANCE_PURCHASE_SCREEN:
        flow = ONBOARDING_FLOW.TCBH;
        break;

      default:
        flow = ONBOARDING_FLOW.DVCT;
        break;
    }
    const { accessToken } = store.getState().auth;
    const confirmAction = () => {
      disConnect();
      TpfSdkClient?.eventHandlers?.onRequestLogin({
        showSdk: () => handleCheckUser(routeName, params, flow, callBack)
      });
    };
    if (accessToken) {
      handleCheckUser(routeName, params, flow, callBack);
      return;
    }
    failure?.();
    dispatch(
      getShowAlertError({
        ...REQUIRE_LOGIN,
        message: t('errMessage.require_login_topenId_message'),
        confirmAction
      })
    );
    setLoading(false);
  };

  const registerMemberFullFromSDK = async (params, success) => {
    const { account } = store.getState().middleware;
    const { flow } = params;
    const { phone, first_name, last_name, dob, gender } = account || {};
    const input = {
      firstName: first_name,
      lastName: last_name,
      phone,
      dob: formatToUtcReq(dob || DEFAULT_DOB),
      gender: parseGenders(gender),
      flow
    };

    dispatch(createMemberFromSDKHandle({ input }, success));
    setLoading(false);
  };

  const createAccountTopenIdToTPF = async (user, success) => {
    const { dob, gender, name, flow } = user || {};
    const input = {
      name,
      dob: formatToUtcReq(dob || DEFAULT_DOB),
      gender: parseGenders(gender),
      flow
    };
    dispatch(createTPFMemberFromSDKHandle({ input }, success));
  };

  useEffect(() => {
    Proxy.initProxy({
      connect,
      disConnect,
      showProducts,
      showApplications,
      showHistorys,
      showBalance,
      showRefund,
      showProductSuggest,
      showDetailNotification,
      requestLogin
    });
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const hideSdk = useCallback(() => {
    dispatch(toggleSdkState({ state: 'hide' }));
  }, []);

  const onCheckStatusSdk = callBack => {
    if (sdkState === 'hide') {
      dispatch(toggleSdkState({ state: 'show' }));
    }
    if (typeof callBack === 'function') {
      callBack();
    }
  };

  const onCheckNavigation = ({ routeName, params, callBack }) => {
    if (callBack) {
      callBack();
      return;
    }
    navigation.navigate(routeName, params);
  };

  const openLegal = ({ routeName, params, legalType, callBack }) => {
    navigation.navigate(SCREENS_NAME.LEGAL_SCREEN, {
      routeName,
      params,
      legalType,
      callBack
    });
  };

  const handleCheckVAS = (data, routeName, params, callBack) => {
    if (data.isVAS) {
      onCheckStatusSdk(
        openLegal({ routeName, params, legalType: LEGAL_TYPE.UPDATE_TOPENID_TO_TPF, callBack })
      );
    } else {
      if (!data?.acceptSDK || !data?.acceptPolicy) {
        onCheckStatusSdk(openLegal({ routeName, params, legalType: LEGAL_TYPE.DEFAULT, callBack }));
      } else onCheckStatusSdk(() => onCheckNavigation({ routeName, params, callBack }));
    }
    setLoading(false);
  };

  const handleCheckUser = async (routeName, params, flow = ONBOARDING_FLOW.TCBH, callBack) => {
    try {
      setLoading(true);
      // Kiểm tra user tồn tại topenId hay chưa ?
      dispatch(
        getTopenIdHandle(
          result => {
            // Kiểm tra user tồn tại Topen Fintech hay chưa ?
            dispatch(
              checkMemberTopenerByTopenIdHandle(
                data => {
                  TpfSdkClient?.eventHandlers?.onConnect(data);
                  // User tồn tại TPF
                  if (data.isExist) {
                    dispatch(setAccountTopenId({ ...data, flow }));
                    if (flow === ONBOARDING_FLOW.DVCT) {
                      onCheckStatusSdk(() => onCheckNavigation({ routeName, params, callBack }));
                      setLoading(false);
                      return;
                    }
                    // Kiểm tra cờ VAS
                    handleCheckVAS(data, routeName, params, callBack);
                  } else {
                    //User chưa có TPF
                    const users = {
                      ...result,
                      name: result?.last_name + ' ' + result?.first_name,
                      flow
                    };
                    if (flow === ONBOARDING_FLOW.DVCT) {
                      createAccountTopenIdToTPF(users, () =>
                        onCheckStatusSdk(() =>
                          onCheckStatusSdk(() => onCheckNavigation({ routeName, params, callBack }))
                        )
                      );
                    } else {
                      dispatch(setAccountTopenId(users));
                      onCheckStatusSdk(
                        openLegal({
                          routeName,
                          params,
                          legalType: LEGAL_TYPE.CREATE_TPF,
                          callBack
                        })
                      );
                    }
                  }
                  setLoading(false);
                },
                error => {
                  TpfSdkClient?.eventHandlers?.onFailWithError(error);
                  setLoading(false);
                }
              )
            );
          },
          error => {
            // Chưa tồn tại topenId
            if (error?.code === '202002') {
              const { account } = store.getState().middleware;
              dispatch(setAccountTopenId({ ...account, flow }));
              if (flow === ONBOARDING_FLOW.DVCT) {
                registerMemberFullFromSDK({ flow }, () =>
                  onCheckStatusSdk(() => onCheckNavigation({ routeName, params, callBack }))
                );
                return;
              }
              // flow TCBH
              onCheckStatusSdk(
                openLegal({ routeName, params, legalType: LEGAL_TYPE.CREATE_TOPENID_TPF, callBack })
              );
              setLoading(false);
              return error;
            }

            TpfSdkClient?.eventHandlers?.onFailWithError({
              code: 'user_invalid',
              message: error?.message
            });
            setLoading(false);
          }
        )
      );
    } catch (error) {
      setLoading(false);
    }
  };

  const showProducts = data => {
    setEvent(data);
    let routeName = '',
      params = {};
    // handle event
    // navigate to screen

    // check code show navi route
    if (data.code === 'credit') {
      // credit
      routeName = SCREENS_NAME.CREDIT_FILTER_SCREEN;
    }
    if (data.code === 'insurance') {
      // insurance
      routeName = SCREENS_NAME.INSURANCE_LIST_SCREEN;
    }
    if (data.code === 'extra_service') {
      // extra_service
      routeName = SCREENS_NAME.EXTRA_SERVICE_LIST_SCREEN;
    }
    if (data.triggerCode) {
      // product_trigger
      routeName = SCREENS_NAME.TRIGGER_FLOW_SCREEN;
      params = { triggerCode: data.triggerCode };
    }
    onCheckStatusSdk(() => navigation.navigate(routeName, params));
  };

  const showApplications = data => {
    let params = {};
    let flow = ONBOARDING_FLOW.DVCT;
    let routeName = '';

    // switch (data?.data?.tab) {
    //   case 2:
    //     flow = ONBOARDING_FLOW.DVCT;
    //     break;
    //   default:
    //     flow = ONBOARDING_FLOW.TCBH;
    //     break;
    // }

    setEvent(data);
    // handle event
    // navigate to screen

    // check code show navi route

    if (data.code === 'create_request') {
      // create_request
      routeName = SCREENS_NAME.CREATE_REQUEST_SCREEN;
    }
    if (data.code === 'application_list') {
      //application_list
      routeName = SCREENS_NAME.APPLICATION_LIST_SCREEN;
      params = { tab: data?.data?.tab }; //0. credit, 1. insurance, 2. request, 3. request support
    }

    handleCheckUser(routeName, params, flow);
  };

  const showHistorys = data => {
    setEvent(data);
    // handle event
    // navigate to screen
    // check code show navi route
    let routeName = SCREENS_NAME.TRANSACTION_HISTORY;
    handleCheckUser(routeName, {}, ONBOARDING_FLOW.DVCT);
  };

  const showBalance = data => {
    setEvent(data);
    // handle event
    // navigate to screen

    // check code show navi route
    let routeName = SCREENS_NAME.ACCOUNT_BALANCE_SCREEN;
    handleCheckUser(routeName, {}, ONBOARDING_FLOW.DVCT);
  };

  const showRefund = data => {
    setEvent(data);
    // handle event
    // navigate to screen

    // check code show navi route
    let routeName = SCREENS_NAME.REFUND_REQUEST_SCREEN;
    handleCheckUser(routeName, {}, ONBOARDING_FLOW.DVCT);
  };
  const showProductSuggest = data => {
    setEvent(data);
    // handle event
    // navigate to screen

    // check code show navi route
    let params = {};
    const { productCode } = data;
    let routeName = SCREENS_NAME.SUGGEST_PRODUCT_LIST_SCREEN;
    params = { productCode };
    onCheckStatusSdk(() => navigation.navigate(routeName, params));
  };

  const showDetailNotification = useCallback(
    data => {
      let status = true;
      const { id, action } = data || {};
      const { memberId, acceptSDK, acceptPolicy } = store.getState().auth;
      if (!memberId || !acceptSDK || !acceptPolicy) {
        // if user not login
        TpfSdkClient?.eventHandlers?.onFailWithError({
          code: 'authorize',
          message: 'User not logged in'
        });
        return;
      }
      if (sdkState === 'hide') {
        dispatch(toggleSdkState({ state: 'show' }));
      }

      switch (action?.toLowerCase()) {
        case 'member.supportrequest.tocustomer':
          navigation.navigate(SCREENS_NAME.SUPPORT_DETAIL_SCREEN, {
            item: { id }
          });
          break;

        case 'transaction.lead':
          navigation.navigate(SCREENS_NAME.LEAD_DETAIL_SCREEN, {
            item: { id }
          });
          break;

        case 'transaction.deal.credit':
        case 'transaction.order.credit':
          navigation.navigate(SCREENS_NAME.CREDIT_ORDER_DETAIL_SCREEN, {
            item: { id },
            orderId: id
          });
          break;

        case 'transaction.order.extraservice':
          navigation.navigate(SCREENS_NAME.EXTRA_SERVICE_ORDER_DETAIL_SCREEN, {
            item: { id }
          });
          break;

        case 'transaction.order.insurance':
          navigation.navigate(SCREENS_NAME.INSURANCE_ORDER_DETAIL_SCREEN, {
            item: { id }
          });
          break;

        case 'transaction.balance':
          navigation.navigate(SCREENS_NAME.ACCOUNT_BALANCE_SCREEN);
          break;
        case 'banner':
        case 'offer':
        case 'rank':
        case 'point':
        default:
          status = false;
          break;
      }
      return status;
    },
    [navigation, sdkState, store]
  );

  return (
    <View style={styles.container}>
      <ActivityIndicator color={CUSTOM_COLOR.DustyGray} size="large" />
      <AppLoading loading={loading} />
    </View>
  );
};

export default MiddleWare;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    alignItems: 'center'
  }
});
