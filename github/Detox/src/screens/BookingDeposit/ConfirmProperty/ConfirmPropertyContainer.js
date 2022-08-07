import {useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {useHaveContactTradingB2CByPropertyPostIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {isAgent} from '../../../appData/user/selectors';
import {FETCH_POLICY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import BaseScreen from '../../../components/BaseScreen';
import {RegisterAgentModal} from '../../../components/Modal/RegisterAgentModal';
import ScrollViewRefresh from '../../../components/ScrollViewRefresh';
import {extractImageUri} from '../../../utils/extractImageUri';
import {getPriceForConfirm, isDepositStatus} from '../../../utils/getPropertyPrice';
import {useLogin} from '../../Auth/useLogin';
import ScreenIds from '../../ScreenIds';
import {TransactionType} from '../../Transaction/DetailTransaction/Components/DetailTransactionConstant';
import {TrackingActions} from '../../WithSegment';
import {ViewBottom} from './ConfirmPropertyComponents';
import {TransactionContextType} from './ConfirmPropertyConstants';
import ConfirmPropertyMainInfo, {getPropertyPostTitle} from './ConfirmPropertyMainInfo';

export const getScreenTitle = data => {
  const {propertyTypeDescription, propertyCode} = data;
  if (!propertyTypeDescription || !propertyCode) {
    return translate(STRINGS.CONFIRM);
  }
  const screenTitle = `${propertyTypeDescription} ${propertyCode}`;
  return screenTitle;
};

const ConfirmPropertyContainer = ({data, onPressConfirm, onRefresh, loading}) => {
  const navigation = useNavigation();
  const {track} = useAnalytics();
  const isSaleAgent = data.isSaleAgent;
  const [haveContactTrading, setHaveContactTrading] = useState(false);
  const isAgentUser = useSelector(isAgent);
  const {notLoggedIn} = useLogin();
  const [showRegisterAgentModal, setShowRegisterAgent] = useState(false);
  const {startApi: checkHaveContactTradingB2C} = useMutationGraphql({
    graphqlApiLazy: useHaveContactTradingB2CByPropertyPostIdLazyQuery,
    dataField: 'haveContactTradingB2CByPropertyPostId',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    showSpinner: true,
  });

  useEffect(() => {
    if (!isSaleAgent && !!data.propertyPostId && isAgentUser && !notLoggedIn) {
      checkHaveContactTradingB2C(
        {variables: {propertyPostId: data.propertyPostId}},
        () => {},
        () => {
          setHaveContactTrading(true);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaleAgent, data?.propertyPostId]);

  const gotoContactToBuyScreen = () => {
    const {price} = getPriceForConfirm({
      isDespositTransaction: isDepositStatus(data.currentMode),
      data,
      translate,
    });

    const projectInfo = {
      property_id: data?.propertyCode ?? '',
      project_status: data?.projectStatusDescription ?? '',
      property_image: data?.images[0] ?? '',
      property_sale_price: data?.rawPrice ?? 0,
      commission: data?.commission ?? '0',
      booking_count: `${data?.numberOfBooking ?? 0}`,
      project_name: data?.projectName ?? '',
      property_type: data?.propertyTypeDescription ?? '',
      property_block: data?.blockName ?? '',
      floor: `${data?.floor ?? 0}`,
      direction: data?.direction ?? '',
      bedroom_number: `${data?.numberOfBedrooms ?? 0}`,
      bathroom_number: `${data?.numberOfBathrooms ?? 0}`,
      builtup_area: `${data?.buildingArea ?? 0}`,
      carpet_area: data?.capetArea ?? '',
      minimum_payment: data?.rawBookingFee ?? 0,
      deposit_price: data?.rawBookingFee ?? 0,
    };

    track(TrackingActions.projectContactToBuyReviewInfo, projectInfo);

    navigation.navigate(ScreenIds.ContactToBuy, {
      isC2C: false,
      propertyPost: {
        price,
        images: data?.images,
        propertyPostId: data.propertyPostId,
        postTitle: getPropertyPostTitle(data),
      },
      image: extractImageUri(data),
    });
  };

  const onPressDeposit = () => {
    navigation.navigate(ScreenIds.ConfirmDepositScreen, {
      transactionId: data?.bookingTransactionInfo?.bookingTransactionId,
      transactionType: TransactionType.Booking,
      isFromPropertyConfirm: true,
      propertyPostId: data?.propertyPostId,
    });
  };

  const onPressBottomButton = () => {
    if (isSaleAgent) {
      data.contextType === TransactionContextType.BookedDeposit
        ? onPressDeposit()
        : onPressConfirm();
    } else {
      gotoContactToBuyScreen();
    }
  };

  const pressToProjectDertail = () => {
    navigation.push(ScreenIds.ProjectDetail, {
      projectId: data?.projectId,
      showBottomView: false,
    });
  };

  const onPressUpgradeToAgent = () => {
    setShowRegisterAgent(true);
  };

  const onPressChooseAnother = () => {
    navigation.goBack();
  };

  return (
    <BaseScreen showHeaderShadow={true} title={getScreenTitle(data)}>
      <ScrollViewRefresh
        loading={loading}
        onRefresh={onRefresh}
        showCenterText={!data.propertyType || !data.propertyCode}>
        <ConfirmPropertyMainInfo data={data} onPressToProjectDetail={pressToProjectDertail} />
      </ScrollViewRefresh>
      <ViewBottom
        data={data}
        onRefresh={onRefresh}
        isAgentUser={isAgentUser}
        isSaleAgent={isSaleAgent}
        onPressUpgradeToAgent={onPressUpgradeToAgent}
        haveContactTrading={haveContactTrading}
        onPress={onPressBottomButton}
        onPressChooseAnother={onPressChooseAnother}
      />
      <RegisterAgentModal
        isShowModal={showRegisterAgentModal}
        setShowModal={setShowRegisterAgent}
      />
    </BaseScreen>
  );
};

export default ConfirmPropertyContainer;
