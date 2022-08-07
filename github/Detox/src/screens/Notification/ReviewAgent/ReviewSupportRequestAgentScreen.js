import React, {useContext, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {
  useCheckContactTradingRequestIsRatedLazyQuery,
  useGetContactTradingRatingByIdLazyQuery,
  useUpdateAgentRatingForSupportRequestMutation,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {DEFAULT_RATING_VALUE, FETCH_POLICY} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {medium, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import ModalPopup from '../../../components/Modal/ModalPopup';
import {callAfterInteraction, useMount} from '../../commonHooks';
import PostSuccessScreen from '../../ManagePost/PostSuccess/PostSuccessScreen';
import ScreenIds from '../../ScreenIds';
import ReviewAgentSupportRequestComponents from './ReviewAgentSupportRequestComponents';

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
  transactionAmount: 0,
  propertyPostInfo: {projectInfo: {projectName: ''}},
  saleAgentInfo: {},
};

const rateSupportQueryOption = (transactionDetail, rating, supportRequestId) => {
  return {
    variables: {
      input: {
        agentId: transactionDetail.saleAgentInfo.agentId,
        agentRating: rating,
        supportRequestId: supportRequestId,
      },
    },
  };
};

const footer = (onConfirm, onReturnHome, disableRating) => {
  return (
    <>
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
    </>
  );
};

const showPopup = (navigation, showSuccessPopup, setShowSuccessPopup) => {
  const onClosePopup = () => {
    setShowSuccessPopup(false);
  };

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
            onPressDismiss={onClosePopup}
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

const mappingSupportInfoToTransaction = detail => {
  return {
    postTitle: detail.postTitle,
    saleAgentInfo: {
      firstName: detail.agentFirstName,
      lastName: detail.agentLastName,
      profilePhoto: detail.agentImage,
      agentId: detail.agentId,
    },
  };
};

const ReviewSupportRequestAgentScreen = ({navigation, route}) => {
  const {showErrorAlert} = useContext(AppContext);
  const [rating, setRating] = useState(DEFAULT_RATING_VALUE);
  const {supportRequestId} = route?.params || {};
  const [transactionDetail, setTransactionDetail] = useState(initialState);
  const [showSuccessPopup, setShowSuccessPopup] = useState();
  const [isCheckRate, setIsCheckRate] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const OnSuccessCheckIsRate = response => {
    const rated = !!response;
    rated && setShowSuccessPopup(true);
    setIsFirstLoad(false);
    setIsCheckRate(rated);
  };
  const {startApi: checkTransactionIsRated} = useGraphqlApiLazy({
    graphqlApiLazy: useCheckContactTradingRequestIsRatedLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'checkContactTradingRequestIsRated',
    onSuccess: OnSuccessCheckIsRate,
    showSpinner: false,
  });
  // Get information
  const onSuccessGetDetail = detail => {
    if (detail) {
      setTransactionDetail(mappingSupportInfoToTransaction(detail));
      callAfterInteraction(() => {
        checkTransactionIsRated({variables: {input: supportRequestId}});
      });
    }
  };

  const {startApi: getContactTrading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetContactTradingRatingByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'contactTradingRatingById',
    onSuccess: onSuccessGetDetail,
    showSpinner: true,
  });

  useMount(() => {
    getContactTrading({variables: {input: supportRequestId}});
  });

  const onSuccess = query => {
    const {errorCode, errorMessage} = query;
    if (errorCode === 0) {
      setShowSuccessPopup(true);
    } else {
      showErrorAlert(errorMessage);
    }
  };

  const {startApi: updateAgentRatingSupport} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateAgentRatingForSupportRequestMutation,
    queryOptions: {},
    dataField: 'updateAgentRatingForSupportRequest',
    showSpinner: true,
    onSuccess,
  });

  const onFinishRating = ratingValue => {
    setRating(ratingValue);
  };

  const onConfirm = () => {
    updateAgentRatingSupport(rateSupportQueryOption(transactionDetail, rating, supportRequestId));
  };
  const onReturnHome = () => {
    navigation.navigate(ScreenIds.Home);
  };

  const disableRating = rating <= 0;

  return (
    <BaseScreen title={translate(STRINGS.REVIEW_AGENT)} testId={ScreenIds.ReviewAgent}>
      {isFirstLoad || isCheckRate ? (
        <View />
      ) : (
        <View style={styles.container}>
          <KeyboardScrollView>
            <ReviewAgentSupportRequestComponents
              transactionDetail={transactionDetail}
              rating={rating}
              readonly={false}
              onFinishRating={onFinishRating}
            />
          </KeyboardScrollView>
          {footer(onConfirm, onReturnHome, disableRating)}
        </View>
      )}
      {showPopup(navigation, showSuccessPopup, setShowSuccessPopup)}
    </BaseScreen>
  );
};

export default ReviewSupportRequestAgentScreen;
