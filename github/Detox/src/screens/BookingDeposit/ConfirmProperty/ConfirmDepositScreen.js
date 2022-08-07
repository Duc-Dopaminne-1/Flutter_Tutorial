import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {useSelector} from 'react-redux';

import {
  useCreateDepositeTransactionMutation,
  useGetPolicyByPostIdForTransactionLazyQuery,
  useGetUserByIdLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {getUserId} from '../../../appData/user/selectors';
import {ERROR_DEPOSIT, FETCH_POLICY, PAGE_CHILD_TYPE} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {medium, METRICS, micro, normal, small, tiny} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import AgreementBookingDeposit from '../../../components/AgreementBookingDeposit';
import Avatar from '../../../components/Avatar';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import ModalPopup from '../../../components/Modal/ModalPopup';
import {useAgreePolicy} from '../../../hooks/useAgreePolicy';
import {downloadFile, fileEndPoints} from '../../../utils/fileHandler';
import PropertyType from '../../ManagePost/PropertyType';
import PoliciesList from '../../PropertyChangeConfirm/PoliciesList';
import ScreenIds from '../../ScreenIds';
import {TransactionType} from '../../Transaction/DetailTransaction/Components/DetailTransactionConstant';
import {ModalConfirmOTP} from '../../Transaction/DetailTransaction/Components/ModalConfirmOTP';
import useSendOTPCode from '../../Transaction/DetailTransaction/Components/useSendOTPCode';
import FailureScreen, {ProjectErrorContainer} from '../Failure/FailureScreen';
import {BookingContext} from '../useBooking';
import SuccessPopup from './SuccessPopup';
import useGetTransactionDetail from './useGetTransactionDetail';

const initialState = {
  type: PropertyType.apartment,
  name: '',
  phone: '',
  code: '',
  floor: '',
  block: '',
  prioritize: '',
  price: '',
  bookedMoney: '',
  policies: [],
  agentId: '',
  propertyPostId: '',
  bookingTransactionId: '',
};

type ViewInfoType = {
  containerStyle: ViewStyle,
  title: string,
  content: string,
  avatar: string,
  contentColor: string,
};

export const ViewInfo = ({
  containerStyle,
  contentColor = COLORS.BLACK_33,
  titleColor = COLORS.BLACK_33,
  title,
  avatar = '',
  content,
  showAvatar = false,
}: ViewInfoType) => {
  return (
    <View style={[styles.infoContainer, containerStyle]}>
      {showAvatar && <Avatar url={avatar} size={40} containerStyle={{marginRight: normal}} />}
      <View style={HELPERS.center}>
        <Text style={{color: titleColor, marginBottom: micro}}>{title}</Text>
        <Text style={{color: contentColor, ...FONTS.bold}}>{content}</Text>
      </View>
    </View>
  );
};

export const ConfirmDepositContainer = ({info, onConfirm, isChecked, toggleButton}) => {
  const {
    properyType,
    projectName,
    bookedMoney,
    price,
    code,
    floor,
    block,
    avatar,
    consultantName,
    name,
    customerPhome,
    policies,
  } = info;

  const propetyLand = properyType === PropertyType.land;
  const blockTitle = propetyLand ? translate(STRINGS.SUB_AREA) : translate(STRINGS.TOWER);
  return (
    <ScrollView style={{padding: normal}}>
      <Text style={styles.sectionText}>{translate('transaction.confirmDeposit.title')}</Text>
      <ViewInfo title={`${translate(STRINGS.PROJECT_NAME)}:`} content={projectName} />
      <View style={HELPERS.row}>
        <ViewInfo
          title={`${translate(STRINGS.PAY_AMOUNT)}:`}
          content={bookedMoney}
          contentColor={COLORS.RED_3D}
          containerStyle={styles.marginBlock}
        />
        <ViewInfo title={translate(STRINGS.PRICE)} content={price} containerStyle={HELPERS.fill} />
      </View>
      <View style={HELPERS.row}>
        <ViewInfo
          title={translate(STRINGS.PRODUCT_CODE)}
          content={code}
          contentColor={COLORS.PRIMARY_A100}
          titleColor={COLORS.PRIMARY_A100}
          containerStyle={styles.propertyCode}
        />
        <View style={HELPERS.fillRow}>
          {!propetyLand ? (
            <ViewInfo
              title={translate(STRINGS.FLOOR)}
              content={floor}
              containerStyle={styles.marginBlock}
            />
          ) : null}
          <ViewInfo title={blockTitle} content={block} containerStyle={HELPERS.fill} />
        </View>
      </View>
      <ViewInfo
        avatar={avatar}
        showAvatar
        title={translate(STRINGS.CONSULTANT)}
        content={consultantName}
        containerStyle={styles.consultantView}
      />
      <View style={HELPERS.row}>
        <ViewInfo
          title={translate(STRINGS.CUSTOMER_FULLNAME)}
          content={name}
          containerStyle={styles.customerName}
        />
        <ViewInfo
          title={translate(STRINGS.PHONE_NUMBER)}
          content={customerPhome}
          containerStyle={HELPERS.fill}
        />
      </View>
      <PoliciesList policies={policies} />
      <View style={METRICS.verticalMargin}>
        <AgreementBookingDeposit
          isAgree={isChecked}
          checkValue={checked => toggleButton(checked)}
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
      <View style={{height: medium}} />
    </ScrollView>
  );
};

const mapBookingDataToModel = (policies, transactionInfo) => {
  const model = {};
  const {
    propertyCode,
    transactionAmount,
    customerInfo,
    floor,
    block,
    projectName,
    price,
    consultantName,
    consultantAvatar,
    propertyTypeName,
  } = transactionInfo;
  model.projectName = projectName;
  model.customerPhome = customerInfo?.customerPhoneNumber;
  model.name = customerInfo?.customerFullName;
  model.code = propertyCode ?? '';
  model.floor = floor ?? '';
  model.block = block ?? '';
  model.consultantName = consultantName;
  model.price = price;
  model.bookedMoney = transactionAmount;
  model.properyType = propertyTypeName;
  model.avatar = consultantAvatar;
  if (policies) {
    model.policies = policies.edges ?? [];
  }
  return model;
};

const mapErrorData = transactionDetail => {
  const errorData = {
    propertyPostInfo: {
      propertyCode: transactionDetail?.propertyCode,
      floor: transactionDetail?.floor,
      blockName: transactionDetail?.block,
      propertyTypeName: transactionDetail?.propertyTypeName,
      projectInfo: {
        projectName: transactionDetail?.projectName,
      },
    },
  };
  return errorData;
};

const ConfirmDepositScreen = ({navigation, route}) => {
  const {
    transactionInfo,
    transactionId,
    transactionType,
    isFromPropertyConfirm = false,
    propertyPostId,
  } = route?.params;
  const userId = useSelector(getUserId);
  const {transactionDetail = {}} = useGetTransactionDetail({
    transactionData: transactionInfo,
    transactionType: transactionType,
    transactionId: transactionId,
    propertyPostId,
    isFromPropertyConfirm: isFromPropertyConfirm,
  });

  const {bookingTransactionInfo = {}, consultantId = {}} = transactionDetail;

  const [getUser, {data: agentInfo}] = useGetUserByIdLazyQuery({...FETCH_POLICY.NETWORK_ONLY});

  const {sendNotifyNewTransaction} = useContext(BookingContext);
  const [isShowSuccessPopup, toggleSuccessPopup] = useState(false);
  const [isClickable, toggleButton] = useState(false);
  const [info, setInfo] = useState(initialState);
  const [depositInfo, setDepositInfo] = useState({});
  const [error, setError] = useState('');
  const [showPopup, setShowFailPopup] = useState(false);
  const [isShowModalOTP, setShowModalOTP] = useState(false);
  const agreePolicy = useAgreePolicy(PAGE_CHILD_TYPE.TERMS_OF_USE);
  const {sendOTP} = useSendOTPCode();
  const onErrorConfirmDeposite = ({message, errorMessageCode}) => {
    if (errorMessageCode === ERROR_DEPOSIT.BOOKING_TO_DEPOSIT_OUT_TIME) {
      setShowModalOTP(false);
      setShowFailPopup(true);
    } else {
      setError(message);
    }
  };

  const onSuccessGetPolicies = data => {
    const temp = mapBookingDataToModel(data, transactionDetail);
    getUser({variables: {userId}});
    setInfo(temp);
  };

  const {startApi: getPolicies} = useGraphqlApiLazy({
    graphqlApiLazy: useGetPolicyByPostIdForTransactionLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'policyByPropertyPostIdForTransaction',
    showSpinner: true,
    onSuccess: onSuccessGetPolicies,
  });

  useEffect(() => {
    if (transactionDetail?.propertyPostId) {
      getPolicies({
        variables: {
          propertyPostId: transactionDetail?.propertyPostId,
          isBooking: false,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionDetail?.propertyPostId]);

  const confirmDepositeSuccess = response => {
    setShowModalOTP(false);
    const depositInfoResponse = response?.depositeTransactionDto;
    toggleSuccessPopup(true);
    setDepositInfo(depositInfoResponse);
    sendNotifyNewTransaction();
  };

  const {startApi: confirmDeposite} = useGraphqlApiLazy({
    showSpinner: true,
    dataField: 'createDepositeTransaction',
    graphqlApiLazy: useCreateDepositeTransactionMutation,
    queryOptions: {},
    onError: onErrorConfirmDeposite,
    onSuccess: confirmDepositeSuccess,
  });

  const showConfirmOTP = () => {
    setShowModalOTP(true);
  };

  const onConfirmed = code => {
    confirmDeposite({
      variables: {
        input: {
          propertyPostId: transactionDetail?.propertyPostId,
          consultantId: consultantId,
          bookingTransactionId: bookingTransactionInfo?.bookingTransactionId,
          topenerPhoneNumber: agentInfo?.userById?.userDto?.phoneNumber,
          otpCode: code,
        },
      },
    });
  };

  const onPressSentOTP = () => {
    sendOTP(
      agentInfo?.userById?.userDto?.phoneNumber,
      bookingTransactionInfo?.bookingTransactionId,
      () => showConfirmOTP(),
    );
  };

  const goBack = () => {
    navigation.pop();
  };

  const onCheckAgreement = () => {
    navigation.navigate(ScreenIds.PageDetail, {
      title: '',
      isShowDate: false,
      pageDetail: {body: agreePolicy.html},
    });
  };

  const onPressOk = () => {
    if (depositInfo.depositeTransactionId) {
      toggleSuccessPopup(false);
      const transactionData = {
        transactionId: depositInfo.depositeTransactionId,
        transactionType: TransactionType.Deposit,
        propertyPostId: transactionDetail?.propertyPostId,
        shouldUpdate: true,
      };
      navigation.goBack();
      navigation.replace(ScreenIds.DetailTransaction, transactionData);
    }
  };

  return (
    <BaseScreen title={translate(STRINGS.CONFIRM)}>
      <ConfirmDepositContainer
        onConfirm={onCheckAgreement}
        isChecked={isClickable}
        info={info}
        toggleButton={toggleButton}
      />
      <View style={styles.bottomView}>
        <CustomButton
          style={[commonStyles.buttonDetail, styles.buttonConfirm]}
          titleStyle={{...FONTS.bold, color: COLORS.PRIMARY_A100}}
          title={translate(STRINGS.RETURN)}
          onPress={goBack}
        />
        <CustomButton
          disabled={!isClickable}
          titleStyle={styles.buttonReview}
          style={[
            styles.buttonDetailTransaction,
            !isClickable && {backgroundColor: COLORS.TEXT_DARK_40},
          ]}
          title={translate(STRINGS.CONFIRM)}
          onPress={onPressSentOTP}
        />
      </View>
      <ModalConfirmOTP
        onDismissError={() => setError('')}
        error={error}
        onDismissModal={() => setShowModalOTP(false)}
        visible={isShowModalOTP}
        onConfirmed={onConfirmed}
        onPressResentOTP={onPressSentOTP}
      />
      {isShowSuccessPopup && (
        <ModalPopup
          contentContainerStyle={METRICS.resetPadding}
          visible={isShowSuccessPopup}
          animationType="slide">
          <SuccessPopup
            onClose={onPressOk}
            onConfirmed={onPressOk}
            title={translate(STRINGS.CONFIRM_CHANGE_BOOKING_TO_DEPOSIT_SUCCESS)}
            message={translate(STRINGS.CONFIRM_CHANGE_BOOKING_TO_DEPOSIT_SUCCESS_DESCRIPTION)}
          />
        </ModalPopup>
      )}
      {showPopup && (
        <ModalPopup
          contentContainerStyle={METRICS.resetPadding}
          visible={showPopup}
          animationType="slide">
          <FailureScreen
            containerView={
              <ProjectErrorContainer transactionDetail={mapErrorData(transactionDetail)} />
            }
            title={translate('modal.failure.depositTimeOut')}
          />
        </ModalPopup>
      )}
    </BaseScreen>
  );
};

export default ConfirmDepositScreen;

const styles = StyleSheet.create({
  sectionText: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.BLACK_4F,
    marginBottom: small,
  },
  buttonDetailTransaction: {
    flex: 1,
    height: 45,
    marginLeft: SIZES.MARGIN_16,
    borderRadius: tiny,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  bottomView: {
    flexDirection: 'row',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: SIZES.PADDING_16,
  },
  buttonConfirm: {
    borderColor: COLORS.PRIMARY_A100,
    borderWidth: SIZES.BORDER_WIDTH_1,
    paddingHorizontal: SIZES.PADDING_16,
    borderRadius: 5,
  },
  infoContainer: {
    height: 64,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_BORDER,
    marginBottom: SIZES.MARGIN_8,
  },
  marginBlock: {flex: 1, marginRight: SIZES.MARGIN_8},
  consultantView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: SIZES.PADDING_16,
  },
  customerName: {flex: 2, marginRight: SIZES.MARGIN_8},
  propertyCode: {flex: 1, marginRight: SIZES.MARGIN_8, backgroundColor: COLORS.GREEN_80},
});
