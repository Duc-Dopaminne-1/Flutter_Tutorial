import isEmpty from 'lodash/isEmpty';
import React, {useContext, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';

import {
  useCheckBookingTransactionIsRatedLazyQuery,
  useGetBookingTransactionDetailForRatingLazyQuery,
  useGetDepositTransactionDetailForRatingLazyQuery,
  useUpdateAgentRatingMutation,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {getUserId} from '../../../appData/user/selectors';
import {DEFAULT_RATING_VALUE, FETCH_POLICY} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {medium, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import ModalPopup from '../../../components/Modal/ModalPopup';
import {callAfterInteraction, useMount} from '../../commonHooks';
import PostSuccessScreen from '../../ManagePost/PostSuccess/PostSuccessScreen';
import ScreenIds from '../../ScreenIds';
import {TransactionType} from '../../Transaction/DetailTransaction/Components/DetailTransactionConstant';
import ReviewAgentComponents from './ReviewAgentComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normal,
  },
  iconModalStyle: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginVertical: medium,
  },
  containerModalStyle: {
    justifyContent: 'space-between',
    marginTop: normal,
  },
  contentContainerStyle: {},
  descriptionModalStyle: {
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
  },
});

const initialState = {
  transactionCode: '',
  projectName: '',
  propertyCode: '',
  isRatingSale: true,
  agentInfo: {},
};

const mapTransactionDetail = ({detail, userId, isBooking}) => {
  if (!detail || isEmpty(detail)) {
    return initialState;
  }

  const isRatingSale = userId !== detail?.saleAgentInfo?.agentId; //to be reviewed agent is sale agent?
  const agentInfo = isRatingSale ? detail?.saleAgentInfo : detail?.buyAgentInfo;
  const transactionCode = isBooking ? detail?.bookingCode : detail?.depositeCode;

  const transactionDetail = {
    transactionCode,
    projectName: detail?.projectName || '',
    propertyCode: detail?.propertyCode || '',
    isRatingSale: isRatingSale,
    agentInfo: agentInfo || {},
  };

  return transactionDetail;
};

const queryOption = ({agentInfo, transactionCode, rating}) => {
  return {
    variables: {
      input: {
        agentRatingDto: {
          agentId: agentInfo?.agentId,
          bookingCode: transactionCode,
          rating: rating,
        },
      },
    },
  };
};

const getQueryOptions = (isBooking, transactionId) => {
  if (isBooking) {
    return {
      variables: {
        bookingTransactionId: transactionId,
      },
    };
  } else {
    return {
      variables: {
        depositeTransactionId: transactionId,
      },
    };
  }
};

const getDataField = isBooking => {
  const dataField = isBooking
    ? 'bookingTransactionDetailForRating'
    : 'depositeTransactionDetailForRating';
  return dataField;
};

const getLazyQuery = isBooking => {
  const lazyQuery = isBooking
    ? useGetBookingTransactionDetailForRatingLazyQuery
    : useGetDepositTransactionDetailForRatingLazyQuery;
  return lazyQuery;
};

const showPopup = (navigation, showSuccessPopup, setShowSuccessPopup) => {
  const onBackToHomeScreen = () => {
    setShowSuccessPopup(false);
    callAfterInteraction(() => {
      navigation.navigate(ScreenIds.Home);
    });
  };

  const onBackToPreviousScreen = () => {
    setShowSuccessPopup(false);
    callAfterInteraction(() => {
      navigation.goBack();
    });
  };

  return (
    <>
      {showSuccessPopup && (
        <ModalPopup visible={showSuccessPopup} animationType="slide">
          <PostSuccessScreen
            onClose={onBackToPreviousScreen}
            onPressDismiss={() => setShowSuccessPopup(false)}
            onReviewPost={onBackToHomeScreen}
            icon={<Image source={IMAGES.IC_LETTER_SUCCESS} style={styles.iconModalStyle} />}
            title={translate(STRINGS.REVIEW_THANK_YOU)}
            titleStyle={styles.titleModalStyle}
            description={translate(STRINGS.REVIEW_THANK_YOU_DES)}
            buttonReviewPostTitle={translate(STRINGS.RETURN_HOME)}
            descriptionStyle={styles.descriptionModalStyle}
            hideReturnHomeButton={true}
            buttonNextStyle={commonStyles.buttonOutline}
            buttonNextTextStyle={commonStyles.buttonOutlineText}
            containerStyle={styles.containerModalStyle}
            contentContainerStyle={styles.contentContainerStyle}
          />
        </ModalPopup>
      )}
    </>
  );
};

const ReviewAgentScreen = ({navigation, route}) => {
  const {showErrorAlert} = useContext(AppContext);
  const [rating, setRating] = useState(DEFAULT_RATING_VALUE);
  const {transactionId, transactionType} = route?.params || {};
  const isBooking = transactionType === TransactionType.Booking;
  const [transactionDetail, setTransactionDetail] = useState(initialState);
  const [showSuccessPopup, setShowSuccessPopup] = useState();
  const [isCheckRate, setIsCheckRate] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const userId = useSelector(getUserId);

  const OnSuccessCheckIsRate = response => {
    const rated = !!response;
    rated && setShowSuccessPopup(true);
    setIsFirstLoad(false);
    setIsCheckRate(rated);
  };

  const {startApi: checkTransactionIsRated} = useGraphqlApiLazy({
    graphqlApiLazy: useCheckBookingTransactionIsRatedLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'checkBookingTransactionIsRated',
    onSuccess: OnSuccessCheckIsRate,
  });

  const onSuccessGetDetail = detail => {
    if (detail) {
      const mappedDetail = mapTransactionDetail({detail, userId, isBooking});
      setTransactionDetail(mappedDetail);
      checkTransactionIsRated({variables: {input: mappedDetail.transactionCode}});
    }
  };

  const {startApi: getTransactionDetail} = useGraphqlApiLazy({
    graphqlApiLazy: getLazyQuery(isBooking),
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: getDataField(isBooking),
    onSuccess: onSuccessGetDetail,
    showSpinner: true,
  });

  useMount(() => {
    transactionId && getTransactionDetail(getQueryOptions(isBooking, transactionId));
  });

  const onSuccess = query => {
    const {errorCode, errorMessage} = query;
    if (errorCode === 0) {
      setShowSuccessPopup(true);
    } else {
      showErrorAlert(errorMessage);
    }
  };

  const {startApi: updateAgentRating} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateAgentRatingMutation,
    queryOptions: {},
    dataField: 'updateAgentRating',
    showSpinner: true,
    onSuccess,
  });

  const onConfirm = () => {
    const {agentInfo, transactionCode} = transactionDetail;
    updateAgentRating(queryOption({agentInfo, transactionCode, rating}));
  };
  const onReturnHome = () => {
    navigation.navigate(ScreenIds.Home);
  };

  const onFinishRating = ratingValue => {
    setRating(ratingValue);
  };

  const disableRating = rating <= 0;

  return (
    <BaseScreen title={translate(STRINGS.REVIEW_AGENT)} testId={ScreenIds.ReviewAgent}>
      {isFirstLoad || isCheckRate ? (
        <View />
      ) : (
        <View style={styles.container}>
          <ReviewAgentComponents
            agentInfo={transactionDetail?.agentInfo}
            transactionCode={transactionDetail?.transactionCode}
            isSale={transactionDetail?.isRatingSale}
            transactionDetail={transactionDetail}
            rating={rating}
            onFinishRating={onFinishRating}
          />
          <CustomButton
            titleStyle={styles.buttonReview}
            style={disableRating ? commonStyles.disabledButtonNext : commonStyles.buttonNext}
            disabled={disableRating}
            title={translate(STRINGS.CONFIRM)}
            onPress={onConfirm}
          />
          <TouchableOpacity onPress={onReturnHome}>
            <View style={commonStyles.greyBorderContainer}>
              <Text style={styles.buttonText}>{translate(STRINGS.RETURN_HOME)}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {showPopup(navigation, showSuccessPopup, setShowSuccessPopup)}
    </BaseScreen>
  );
};

export default ReviewAgentScreen;
