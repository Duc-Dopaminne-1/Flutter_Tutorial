import React, {useContext, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {SpringScrollView} from 'react-native-spring-scrollview';
import {useSelector} from 'react-redux';

import {
  useGetPolicyByPostIdForTransactionLazyQuery,
  useGetUserByIdLazyQuery,
  useMoveDepositeTransactionMutation,
} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../appData/appContext/useAppContext';
import {getUserId} from '../../appData/user/selectors';
import {ERROR_DEPOSIT, FETCH_POLICY, PAGE_CHILD_TYPE} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {HELPERS} from '../../assets/theme/helpers';
import {medium, METRICS, normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import AgreementBookingDeposit from '../../components/AgreementBookingDeposit';
import BaseScreen from '../../components/BaseScreen';
import CustomButton from '../../components/Button/CustomButton';
import ModalPopup from '../../components/Modal/ModalPopup';
import {useAgreePolicy} from '../../hooks/useAgreePolicy';
import {downloadFile, fileEndPoints} from '../../utils/fileHandler';
import SuccessScreen from '../BookingDeposit/Success/SuccessScreen';
import {BookingContext} from '../BookingDeposit/useBooking';
import {useMount} from '../commonHooks';
import {rootNavigationRef} from '../navigate';
import ScreenIds from '../ScreenIds';
import {TransactionType} from '../Transaction/DetailTransaction/Components/DetailTransactionConstant';
import {ModalConfirmOTP} from '../Transaction/DetailTransaction/Components/ModalConfirmOTP';
import useSendOTPCode from '../Transaction/DetailTransaction/Components/useSendOTPCode';
import {ChangeType} from './ChangeType';
import InfoCell from './InfoCell';
import PoliciesList from './PoliciesList';
import PropertyInfoGrid from './PropertyInfoGrid';

export const PropertyChangeConfirmView = ({
  changeType,
  originalProperty,
  consultantInfo,
  newProperty,
  policies,
  setPropertyChangeable,
  onPressChange,
  propertyChangeable,
  confirmButtonText,
  isShowSuccessPopup,
  project,
  onConfirm,
  onPressBuyMore,
  onReviewNewPost,
}) => {
  return (
    <>
      <SpringScrollView>
        <View style={styles.viewInfoProject}>
          <InfoCell label={translate('changeProperty.projectName')} value={project?.projectName} />
          <View style={{height: SIZES.SEPARATOR_16}} />
          <InfoCell
            valueStyle={{color: COLORS.PRIMARY_B100}}
            label={translate('changeProperty.paid')}
            value={newProperty?.bookingFee}
          />
        </View>
        <View style={styles.contentContainer}>
          <PropertyInfoGrid
            changeType={changeType}
            property={originalProperty}
            consultantInfo={consultantInfo}
          />
          <Image source={IMAGES.IC_CHANGE} style={styles.image} />
          <PropertyInfoGrid
            changeType={changeType}
            isNew={true}
            property={newProperty}
            consultantInfo={consultantInfo}
          />
          <PoliciesList
            style={[METRICS.horizontalMargin, METRICS.retsetVerticalMargin, METRICS.marginTop]}
            policies={policies}
          />
          <View style={styles.checkboxContainer}>
            <AgreementBookingDeposit
              isAgree={false}
              checkValue={isChecked => setPropertyChangeable(isChecked)}
              sectionTitle={translate('agreement.sectionTitle')}
              documentText={translate('agreement.fileDeposit')}
              termsAndPolicyText={translate('agreement.policyAndCondition')}
              acceptTermText={translate('agreement.acceptTermText')}
              onPressTermsAndPolicy={onConfirm}
              onDocumentDownload={() =>
                downloadFile({
                  fileName: 'XacNhanQuyenThamGiaDatCoc',
                  endPoint: fileEndPoints.GET_DEPOSIT_TEMPLATE,
                  fileExtension: 'pdf',
                })
              }
            />
          </View>
        </View>
      </SpringScrollView>
      <View style={[HELPERS.row, {backgroundColor: COLORS.NEUTRAL_WHITE, padding: normal}]}>
        <CustomButton
          onPress={() => {
            rootNavigationRef.current?.navigate(ScreenIds.Home);
          }}
          style={styles.buttonToHome}
          title={translate(STRINGS.HOME)}
          titleColor={COLORS.PRIMARY_A100}
        />
        <CustomButton
          onPress={onPressChange}
          disabled={!propertyChangeable}
          style={[propertyChangeable ? styles.button : styles.buttonDisabled]}
          title={confirmButtonText}
          titleColor={COLORS.NEUTRAL_WHITE}
        />
      </View>
      {isShowSuccessPopup && (
        <ModalPopup
          contentContainerStyle={METRICS.resetPadding}
          visible={isShowSuccessPopup}
          animationType="slide">
          <SuccessScreen
            title={translate('changeProperty.depositSuccess')}
            isBooking={false}
            transactionDetail={{
              propertyPostInfo: {
                ...newProperty,
              },
            }}
            projectInfo={project}
            consultantInfo={consultantInfo}
            transactionType={'Booking'}
            onPressBuyMore={onPressBuyMore}
            onReviewNewPost={onReviewNewPost}
          />
        </ModalPopup>
      )}
    </>
  );
};

const PropertyChangeConfirmScreen = ({navigation, route}) => {
  const {showAppModal} = useContext(AppContext);
  const changeType = ChangeType.deposit;
  const screenTitle = translate(STRINGS.CONFIRM_CHANGE);
  const userId = useSelector(getUserId);
  const confirmButtonText =
    changeType === ChangeType.booking
      ? translate(STRINGS.CHANGE_PROPERTY)
      : translate(STRINGS.CHANGE_PRODUCT);
  const [policies, setPolicies] = useState([]);
  const [propertyChangeable, setPropertyChangeable] = useState(false);
  const [isShowSuccessPopup, toggleSuccessPopup] = useState(false);
  const {state: bookingState, sendNotifyNewTransaction} = useContext(BookingContext);
  const consultantInfo = route?.params?.consultantInfo;
  const project = bookingState.project;
  const newProperty = bookingState.propertyPost;
  const {
    bookingTransactionId,
    depositeTransactionId,
    propertyPost: originalProperty,
  } = bookingState.originTransaction;
  const isBooking = false;
  const [newDepositeTransactionId, setNewDepositeTransactionId] = useState('');
  const [isShowModalOTP, setShowModalOTP] = useState(false);

  const [getUser, {data: agentInfo}] = useGetUserByIdLazyQuery({...FETCH_POLICY.NETWORK_ONLY});

  const onGetPoliciesSuccess = policiesData => setPolicies(policiesData?.edges ?? []);
  const onMoveDeopositSuccess = data => {
    const transactionId = data?.depositeTransactionDto?.depositeTransactionId;
    setShowModalOTP(false);
    setNewDepositeTransactionId(transactionId);
    toggleSuccessPopup(true);
    sendNotifyNewTransaction();
  };
  const {sendOTP} = useSendOTPCode();
  const onPressOkErrorDialog = ({errorMessageCode}) => {
    if (
      errorMessageCode === ERROR_DEPOSIT.PROPERTY_DEPOSITED_1 ||
      errorMessageCode === ERROR_DEPOSIT.PROPERTY_DEPOSITED_3
    ) {
      navigation.navigate(ScreenIds.Home);
    }
  };

  const onErrorMoveDeposit = ({errorMessage, errorMessageCode}) => {
    showAppModal({
      isVisible: true,
      title: translate(STRINGS.DEFAULT_MODAL_TITLE),
      message: errorMessage,
      onOkHandler: () => onPressOkErrorDialog({errorMessageCode}),
    });
  };

  const {startApi: getPolicies} = useGraphqlApiLazy({
    graphqlApiLazy: useGetPolicyByPostIdForTransactionLazyQuery,
    dataField: 'policyByPropertyPostIdForTransaction',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onGetPoliciesSuccess,
  });

  const {startApi: moveDeposit} = useGraphqlApiLazy({
    graphqlApiLazy: useMoveDepositeTransactionMutation,
    dataField: 'moveDepositeTransaction',
    queryOptions: {},
    showSpinner: true,
    onSuccess: onMoveDeopositSuccess,
    onError: onErrorMoveDeposit,
  });

  useMount(() => {
    getPolicies({variables: {propertyPostId: newProperty.propertyPostId, isBooking}});
    getUser({variables: {userId}});
  });

  const showConfirmOTP = () => {
    setShowModalOTP(true);
  };

  const onPressChange = () => {
    sendOTP(agentInfo?.userById?.userDto?.phoneNumber, bookingTransactionId, () =>
      showConfirmOTP(),
    );
  };

  const onPressConfirmed = code => {
    moveDeposit({
      variables: {
        input: {
          currentBookingTransactionId: bookingTransactionId,
          currentDepositeTransactionId: depositeTransactionId,
          newPropertyPostId: newProperty.propertyPostId,
          consultantId: consultantInfo?.staffId,
          topenerPhoneNumber: agentInfo?.userById?.userDto?.phoneNumber,
          otpCode: code,
        },
      },
    });
  };

  const onPressBuyMore = () => {
    navigation.replace(ScreenIds.ProjectDetail, {projectId: project?.projectId});
  };

  const agreePolicy = useAgreePolicy(PAGE_CHILD_TYPE.TERMS_OF_USE);

  const onConfirm = () => {
    navigation.navigate(ScreenIds.PageDetail, {
      title: '',
      isShowDate: false,
      pageDetail: {body: agreePolicy.html},
    });
  };

  const onReviewNewPost = () => {
    toggleSuccessPopup(false);
    navigation.navigate(ScreenIds.Transaction);
    navigation.navigate(ScreenIds.DetailTransaction, {
      transactionId: newDepositeTransactionId,
      transactionType: TransactionType.Deposit,
      propertyPostId: newProperty?.propertyPostId,
    });
  };

  return (
    <BaseScreen title={screenTitle} showHeaderShadow>
      <PropertyChangeConfirmView
        screenTitle={screenTitle}
        changeType={changeType}
        originalProperty={originalProperty}
        consultantInfo={consultantInfo}
        newProperty={newProperty}
        policies={policies}
        onPressBuyMore={onPressBuyMore}
        onConfirm={onConfirm}
        setPropertyChangeable={setPropertyChangeable}
        onPressChange={onPressChange}
        propertyChangeable={propertyChangeable}
        confirmButtonText={confirmButtonText}
        isShowSuccessPopup={isShowSuccessPopup}
        project={project}
        onReviewNewPost={onReviewNewPost}
      />
      <ModalConfirmOTP
        onDismissModal={() => setShowModalOTP(false)}
        onPressResentOTP={onPressChange}
        onConfirmed={onPressConfirmed}
        visible={isShowModalOTP}
      />
    </BaseScreen>
  );
};

export default PropertyChangeConfirmScreen;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingTop: SIZES.PADDING_16,
  },
  image: {
    alignSelf: 'center',
    marginVertical: medium,
  },
  button: {
    ...commonStyles.buttonNext,
    marginTop: 0,
    flex: 1,
  },
  buttonDisabled: {
    ...commonStyles.buttonNext,
    marginTop: 0,
    backgroundColor: COLORS.DISABLE_BUTTON,
    flex: 1,
  },
  viewInfoProject: {
    paddingHorizontal: 16,
    paddingVertical: normal,
    marginBottom: 16,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  buttonToHome: {
    ...commonStyles.buttonNext,
    marginTop: 0,
    flex: 1,
    borderWidth: SIZES.BORDER_WIDTH_1,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderColor: COLORS.PRIMARY_A100,
    marginRight: normal,
  },
  checkboxContainer: {
    ...METRICS.horizontalMargin,
    ...METRICS.marginTop,
    marginBottom: medium,
  },
});
