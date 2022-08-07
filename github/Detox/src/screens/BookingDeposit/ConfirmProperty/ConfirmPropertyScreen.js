import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useState} from 'react';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {TRANSACTION_MODE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import NumberUtils from '../../../utils/NumberUtils';
import {CheckDateActiveInRange} from '../../../utils/UserTimer';
import {parsePlaceToAddress} from '../../Profile/CreateEditProfile/BasicAgentProfileComponent';
import {useCheckBooking} from '../../ProjectDetail/hooks/useCheckBooking';
import ScreenIds from '../../ScreenIds';
import {TrackingActions} from '../../WithSegment';
import {BookingContext} from '../useBooking';
import {useCheckLockPropertyPost} from '../useCheckLockPropertyPost';
import {useGetCurrentTopenerInfo} from '../useGetCurrentTopener';
import {INITIAL_CONFIRM_PROPERTY_DATA, TransactionContextType} from './ConfirmPropertyConstants';
import ConfirmPropertyContainer from './ConfirmPropertyContainer';
import useHandleDataConfirmProperty from './useHandleDataConfirmProperty';

const navigateNextScreen = ({data, navigation, consultantInfo, propertyPostId, track}) => {
  switch (data.contextType) {
    case TransactionContextType.MoveDeposit:
      navigation.navigate(ScreenIds.PropertyChangeConfirm, {consultantInfo});
      break;
    case TransactionContextType.NewDeposit:
    case TransactionContextType.Booking:
      track();

      navigation.navigate(ScreenIds.SellAgentList, {
        propertyPostId,
        price: data?.bookingFee,
        staffGroupIds: data.staffGroupIds,
      });
      break;
  }
};

const ConfirmPropertyScreen = ({navigation, route}) => {
  const {track} = useAnalytics();
  const {
    state: moduleState,
    setPropertyPost,
    setIsLoggedInUserSaleAgent,
    setTransactionMode,
    setUpdateProjectDetail,
  } = useContext(BookingContext);
  const {showErrorAlert, showAppModal, showMessageAlert} = useContext(AppContext);
  const {propertyPostId, consultantInfo} = route?.params ?? {};
  const {projectStatusDescription, projectStatus, featurePhotos} = moduleState?.project ?? {};
  const transactionMode = projectStatus ?? TRANSACTION_MODE.NOTHING;
  const saleSeasonId = moduleState.saleSeasonId;
  const [data, setData] = useState(INITIAL_CONFIRM_PROPERTY_DATA);

  const state = {...data, projectStatusDescription, featurePhotos};

  const {
    data: dataAPI,
    countDownState,
    getGetDetailPropertyAndIsSaleAgent,
    getPropertyForTransaction,
    loadingDetailProperty,
    loadingDetailPropertyAndAgent,
  } = useHandleDataConfirmProperty({
    propertyPostId,
    saleSeasonId,
    transactionMode,
    setIsLoggedInUserSaleAgent,
  });

  const trackWithSegment = () => {
    let emptyValue;
    const projectInfo = {
      property_id: state?.propertyCode,
      project_status: state?.projectStatusDescription,
      property_image: state?.images[0] ?? state?.featurePhotos ?? '',
      property_sale_price: state?.rawPrice,
      commission: state?.buyCommission,
      booking_count: state?.numberOfBooking || emptyValue,
      project_name: state?.projectName,
      property_type: state?.propertyTypeDescription,
      property_block: state?.blockName,
      floor: `${state?.floor ?? ''}`,
      direction: state?.direction ?? '',
      bedroom_number: state?.numberOfBedrooms || emptyValue,
      bathroom_number: state?.numberOfBathrooms || emptyValue,
      builtup_area: state?.buildingArea ?? '',
      carpet_area: state?.capetArea ?? '',
      minimum_payment: NumberUtils.parseFloatValue(state?.rawBookingFee),
    };

    track(TrackingActions.projectOrderReviewInfo, projectInfo);
  };

  const {checkBooking} = useCheckBooking({
    onSuccess: () => {
      navigateNextScreen({
        data: state,
        navigation,
        consultantInfo,
        propertyPostId,
        track: trackWithSegment,
      });
    },
    onError: errorMessage => {
      showAppModal({
        isVisible: true,
        title: translate('ERROR'),
        message: errorMessage,
        onOkHandler: () => {
          navigation.navigate(ScreenIds.ProjectDetail);
        },
      });
    },
  });

  const onCheckLock = result => {
    if (result?.isLocked === false) {
      navigateNextScreen({
        data: state,
        navigation,
        consultantInfo,
        propertyPostId,
        track: trackWithSegment,
      });
    } else if (result?.isLocked === true) {
      showErrorAlert(
        translate(STRINGS.LOCK_PROPERTY, {
          propertyTypeDescription: state.propertyTypeDescription,
        }),
      );
    }
  };

  const {checkLockPropertyPost} = useCheckLockPropertyPost({
    propertyPostId,
    onSuccess: onCheckLock,
  });

  const {getCurrentTopener} = useGetCurrentTopenerInfo({
    onSuccess: data => onGetTopenerInfoSuccess(data),
  });

  const mapTopenerInfoToState = topenerInfo => {
    const tempState = {
      permanentAddress: parsePlaceToAddress(JSON.parse(topenerInfo?.permanentAddress)),
      contactAddress: parsePlaceToAddress(JSON.parse(topenerInfo?.contactAddress)),
      firstName: topenerInfo?.firstName,
      lastName: topenerInfo?.lastName,
      email: topenerInfo?.email,
      dob: topenerInfo?.dob,
      phoneNumber: topenerInfo?.phoneNumber,
      nationalId: topenerInfo?.nationalId,
      nationalIdIssueDate: topenerInfo?.nationalIdIssueDate,
      nationalIdIssuePlace: topenerInfo?.nationalIdIssuePlace,
      nationalIdType: topenerInfo?.nationalIdType,
      gender: topenerInfo?.gender,
    };
    return tempState;
  };

  const checkBookingProperty = () => {
    setPropertyPost(state);
    if (state.contextType === TransactionContextType.Booking) {
      checkBooking({saleSeasonId, propertyPost: {propertyPostId}});
    } else {
      checkLockPropertyPost();
    }
  };

  const onGetTopenerInfoSuccess = topenerInfo => {
    if (!isEmpty(topenerInfo)) {
      if (!topenerInfo?.isCompletedProfile) {
        navigation.navigate(ScreenIds.UpdateUserInfoTransaction, {
          topenerInfo: mapTopenerInfoToState(topenerInfo),
          contextType: data.contextType,
          bookingFee: data.bookingFee,
          callBackAfterUpdateProfile: () => {
            navigation.goBack();
            checkBookingProperty();
          },
        });
      } else {
        checkBookingProperty();
      }
    }
  };

  const onTimeCountStart = () => {
    if (state.contextType === TransactionContextType.CannotDeposit) {
      getPropertyForTransaction({isShowSpinner: true});
    }
  };

  const onTimeCountEnd = () => getPropertyForTransaction({isShowSpinner: true});

  const {startCount, cancelCountTime, checkTimerRunning} = CheckDateActiveInRange({
    dateStart: countDownState.dateStart,
    dateEnd: countDownState.dateEnd,
    onTimeEnd: onTimeCountEnd,
    onTimeStart: onTimeCountStart,
  });

  useEffect(() => {
    if (dataAPI) {
      setData(dataAPI);
      if (checkTimerRunning() && dataAPI.contextType !== TransactionContextType.BookedDeposit) {
        cancelCountTime();
      }
      if (dataAPI.currentMode && dataAPI.currentMode !== transactionMode) {
        setTransactionMode(dataAPI.currentMode);
        setUpdateProjectDetail(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAPI]);

  useEffect(() => {
    if (countDownState.bookingTransactionId) {
      startCount();
    }
    return cancelCountTime;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countDownState]);

  useEffect(() => {
    if (propertyPostId) {
      getGetDetailPropertyAndIsSaleAgent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyPostId]);

  const onPressConfirm = () => {
    getCurrentTopener();
  };

  const onRefresh = () => {
    getPropertyForTransaction({isShowSpinner: false});
  };

  return (
    <ConfirmPropertyContainer
      showMessageAlert={showMessageAlert}
      data={state}
      onPressConfirm={onPressConfirm}
      onRefresh={onRefresh}
      loading={loadingDetailProperty || loadingDetailPropertyAndAgent}
    />
  );
};

export default ConfirmPropertyScreen;
