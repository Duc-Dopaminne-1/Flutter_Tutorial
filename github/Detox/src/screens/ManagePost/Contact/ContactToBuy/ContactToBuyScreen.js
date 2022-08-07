import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import {
  useGetAgentDetailLazyQuery,
  useGetUserByIdLazyQuery,
} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../../appData/appContext/appContext';
import {getUserId, isAgent} from '../../../../appData/user/selectors';
import {CONTACT_TRADING_TYPE, FETCH_POLICY, SEARCH_TYPE_INDEX} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {METRICS, normal} from '../../../../assets/theme/metric';
import BaseScreen from '../../../../components/BaseScreen';
import ModalPopup from '../../../../components/Modal/ModalPopup';
import Configs from '../../../../configs';
import {useContactToBuy} from '../../../../hooks/useContactToBuy';
import {useContactTradingB2C} from '../../../../hooks/useContactTradingB2C';
import {useMount} from '../../../commonHooks';
import ScreenIds from '../../../ScreenIds';
import {Category, TrackingActions} from '../../../WithSegment';
import {ContactSuccessContainer} from '../ContactSuccessContainer';
import ContactToBuyForm from './ContactToBuyForm';
import {useServices} from './ListSupportTypes';

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    alignSelf: 'center',
  },
  leftIconContainerStyle: {
    paddingEnd: normal,
    paddingVertical: 0,
  },
  leftIconStyle: {
    marginTop: 0,
  },
  successPopupStyle: {
    padding: 0,
  },
  customButton: {
    flex: 1,
    marginRight: 0,
    ...METRICS.smallHorizontalPadding,
  },
});

const ContactToBuyScreen = ({navigation, route}) => {
  const {
    image,
    propertyPost,
    isC2C = true,
    alreadyContactedToBuy,
    alreadyContactedToRent,
  } = route?.params || {};
  const {track} = useAnalytics();
  const {showAppModal} = useContext(AppContext);

  const rentPrice = propertyPost?.propertyPostForRentDto?.rentPrice;
  const rentPeriod = propertyPost?.propertyPostForRentDto?.rentPeriod;
  const [state, setState] = useState({
    showSuccessPopup: false,
    contactTradingIdAfterContactSucceed: '',
    user: {},
    agentInfo: {},
    contactType: CONTACT_TRADING_TYPE.BUY,
    contactTradingCode: '',
  });
  const userId = useSelector(getUserId);
  const isAgentUser = useSelector(isAgent);
  const additionalCreateContactTradingData = {
    contactType: state.contactType,
    rentPrice,
    rentPeriod,
  };
  const showSuccessPopup = (show = true) => {
    setState({...state, showSuccessPopup: show});
  };
  const serviceHook = useServices();

  const {createContactTradingRequest} = useContactToBuy({
    onSubmitSuccess: data => {
      track(TrackingActions.createBuyRequestSucceeded, {
        property_name: propertyPost?.postTitle,
        category: Category.buy,
        property_url: propertyPost?.detailPath
          ? `${Configs.portal.PORTAL_URL}${propertyPost?.detailPath}`
          : '',
      });

      setState({
        ...state,
        contactTradingIdAfterContactSucceed: data?.contactTradingId,
        contactTradingCode: data?.contactTradingCode,
        showSuccessPopup: true,
      });
    },
    onError: data => {
      showAppModal({
        isVisible: true,
        title: translate(STRINGS.NOTIFICATION),
        message: data?.errorMessage,
        cancelText: translate('common.continueSearch'),
        okText: translate(STRINGS.VIEW_DETAIL),
        onOkHandler: () => {
          onPressDetail({
            contactTradingCode: data?.contactTradingCode,
            contactTradingId: data?.contactTradingId,
          });
        },
        onCancelHandler: onPressContinue,
        onDismiss: onPressContinue,
        okButtonStyle: styles.customButton,
        cancelButtonStyle: styles.customButton,
      });
    },
    additionalData: additionalCreateContactTradingData,
  });

  const {createContactTradingB2C, id: contactTradingB2CId} = useContactTradingB2C({
    onSubmitSuccess: () => {
      track(TrackingActions.projectContactToBuySucceeded, {
        property_name: propertyPost?.postTitle,
        category: Category.project,
      });

      showSuccessPopup(true);
    },
  });

  const onSuccess = data => {
    if (data.userDto) {
      setState({...state, user: data.userDto});
    }
  };

  const onSuccessGetAgentDetail = data => {
    if (data) {
      setState({...state, agentInfo: data});
    }
  };
  const onError = () => {
    //do-nothing
  };

  const {startApi: getUserInfo} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userById',
    onSuccess,
    onError,
  });

  const {startApi: getAgentDetail} = useGraphqlApiLazy({
    graphqlApiLazy: useGetAgentDetailLazyQuery,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'agentById',
    onSuccess: onSuccessGetAgentDetail,
    onError,
  });

  useMount(() => {
    getUserInfo({variables: {userId}});
    if (isAgentUser) {
      getAgentDetail({variables: {agentId: userId}});
    }
  });

  const onSubmit = input => {
    const data = {
      ...input,
      serviceIds: serviceHook.selectedIds ?? [],
    };

    if (isC2C) {
      track(TrackingActions.sendContactSubmitted, {
        category: Category.buy,
        full_name: data?.customerFullName ?? '',
        email: data?.customerEmail ?? '',
        phone_number: data?.customerPhoneNumber ?? '',
        product_name: propertyPost?.postTitle,
        page_url: propertyPost?.detailPath
          ? `${Configs.portal.PORTAL_URL}${propertyPost?.detailPath}`
          : '',
        support_service:
          JSON.stringify(serviceHook.items.filter(e => e?.selected).map(e => e?.name)) ?? '',
      });
      createContactTradingRequest(data);
    } else {
      track(TrackingActions.projectContactToBuySubmitRegister, {
        property_image: propertyPost?.images[0] ?? '',
        full_name: data?.customerFullName ?? '',
        email: data?.customerEmail ?? '',
        phone_number: data?.customerPhoneNumber ?? '',
        property_name: propertyPost?.postTitle,
        support_service: JSON.stringify(
          serviceHook.items.filter(e => e?.selected).map(e => e?.name),
        ),
      });
      createContactTradingB2C(data);
    }
  };

  const onPressContinue = () => {
    showSuccessPopup(false);
    if (isC2C) {
      navigation.navigate(ScreenIds.Search, {
        tabIndex: SEARCH_TYPE_INDEX.C2C,
      });
    } else {
      navigation.navigate(ScreenIds.ConfirmProperty);
      navigation.goBack();
    }
  };

  const onPressDetail = ({contactTradingId, contactTradingCode}) => {
    showSuccessPopup(false);
    if (isC2C) {
      navigation.navigate(ScreenIds.Search, {
        tabIndex: SEARCH_TYPE_INDEX.C2C,
      });
      navigation.navigate(ScreenIds.RequestDetailStack, {
        screen: ScreenIds.RequestDetail,
        params: {
          requestId: state.contactTradingIdAfterContactSucceed || contactTradingId,
          contactTradingCode: state.contactTradingCode || contactTradingCode,
          isSending: true,
        },
      });
    } else {
      navigation.navigate(ScreenIds.Home);
      navigation.navigate(ScreenIds.RequestDetailStack, {
        screen: ScreenIds.RequestDetail,
        params: {
          requestId: contactTradingB2CId,
          isSending: true,
          isB2C: true,
        },
      });
    }
  };

  return (
    <BaseScreen
      title={translate('propertyPost.sendContactRequest')}
      headerOptions={{
        leftTextStyle: styles.headerTitle,
        leftIconStyle: styles.leftIconStyle,
        leftIconContainerStyle: styles.leftIconContainerStyle,
      }}>
      <ContactToBuyForm
        state={state}
        setState={setState}
        image={image}
        isC2C={isC2C}
        postTitle={propertyPost?.postTitle}
        propertyPost={propertyPost}
        setShowSuccessPopup={showSuccessPopup}
        services={serviceHook.items}
        onSelectService={serviceHook.onSelectItem}
        createContactTradingRequest={onSubmit}
        alreadyContactedToRent={alreadyContactedToRent}
        alreadyContactedToBuy={alreadyContactedToBuy}
      />
      <ModalPopup
        contentContainerStyle={styles.successPopupStyle}
        visible={state.showSuccessPopup}
        animationType="slide">
        <ContactSuccessContainer
          title={translate('contactTrading.success.title')}
          subTitle={translate('contactTrading.success.description')}
          onPressContinue={onPressContinue}
          onPressDetail={onPressDetail}
          continueButtonTitle={
            isC2C
              ? translate('common.continueSearch')
              : translate('contactTrading.success.continue')
          }
          detailButtonTitle={
            isC2C ? translate(STRINGS.VIEW_DETAIL) : translate('contactTrading.success.detail')
          }
        />
      </ModalPopup>
    </BaseScreen>
  );
};

export default ContactToBuyScreen;
