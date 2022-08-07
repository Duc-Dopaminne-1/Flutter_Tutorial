import {useAnalytics} from '@segment/analytics-react-native';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import {useGetUserByIdLazyQuery} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {getUserId} from '../../../../appData/user/selectors';
import {
  CONSULT_BANKLOAN_SUPPORT_TYPE,
  CREATE_ACCOUNT_SUPPORT_TYPE,
  FETCH_POLICY,
} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {normal} from '../../../../assets/theme/metric';
import BaseScreen from '../../../../components/BaseScreen';
import ModalPopup from '../../../../components/Modal/ModalPopup';
import {useLogin} from '../../../Auth/useLogin';
import {useMount} from '../../../commonHooks';
import ScreenIds from '../../../ScreenIds';
import {Category, TrackingActions} from '../../../WithSegment';
import {ContactSuccessContainer} from '../ContactSuccessContainer';
import ContactToAdviceForm from './ContactToAdviceForm';

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
});

const ContactToAdviceScreen = ({navigation, route}) => {
  const {
    postTitle,
    image,
    hideImage,
    backButtonTitle,
    propertyPostId,
    projectId,
    supportRequestType,
    loan,
  } = route?.params || {};
  const {track} = useAnalytics();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const userId = useSelector(getUserId);
  const [user, setUser] = useState({});
  const {notLoggedIn} = useLogin();

  const isCreateAccountSupport = supportRequestType === CREATE_ACCOUNT_SUPPORT_TYPE;
  const isConsultBankLoanSupport = supportRequestType === CONSULT_BANKLOAN_SUPPORT_TYPE;

  const onSuccess = data => {
    if (data.userDto) {
      setUser(data.userDto);
    }
  };

  const onError = () => {
    //do-nothing
  };

  const onCloseModal = () => {
    setShowSuccessPopup(false);
    if (isConsultBankLoanSupport) {
      navigation.navigate(ScreenIds.PlusService);
    } else if (isCreateAccountSupport) {
      navigation.navigate(ScreenIds.MainStack);
    } else {
      navigation.goBack();
    }
  };

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userById',
    onSuccess,
    onError,
  });

  useMount(() => {
    if (notLoggedIn) {
      return;
    }
    if (!isCreateAccountSupport) {
      startApi({variables: {userId}});
    }
  });

  const getTitleButtonReview = () => {
    if (backButtonTitle) {
      return backButtonTitle;
    }
    if (isCreateAccountSupport) {
      return translate(STRINGS.CLOSE);
    }
    return translate(propertyPostId ? STRINGS.BACK_TO_POST_SORT : STRINGS.BACK_TO_PROJECT_DETAIL);
  };

  const onSubmitSucceed = request => {
    track(TrackingActions.consultancySubmitted, {
      category: projectId ? Category.project : Category.buy,
      name: postTitle,
      consult_information: request?.name ?? '',
    });

    setShowSuccessPopup(true);
  };

  return (
    <BaseScreen
      title={translate(STRINGS.REQUEST_SUPPORT)}
      headerOptions={{
        leftTextStyle: styles.headerTitle,
        leftIconStyle: styles.leftIconStyle,
        leftIconContainerStyle: styles.leftIconContainerStyle,
      }}>
      <ContactToAdviceForm
        image={image}
        hideImage={hideImage}
        postTitle={postTitle}
        propertyPostId={propertyPostId}
        projectId={projectId}
        onSubmitSuccess={onSubmitSucceed}
        notLoggedIn={notLoggedIn}
        user={user}
        loan={loan}
        supportRequestType={supportRequestType}
      />
      {showSuccessPopup && (
        <ModalPopup
          contentContainerStyle={styles.successPopupStyle}
          visible={showSuccessPopup}
          animationType="slide">
          <ContactSuccessContainer
            title={translate('contactAdvice.success.title')}
            subTitle={translate('contactAdvice.success.description')}
            showContinueButton={false}
            onPressDetail={onCloseModal}
            detailButtonTitle={getTitleButtonReview()}
          />
        </ModalPopup>
      )}
    </BaseScreen>
  );
};

export default ContactToAdviceScreen;
