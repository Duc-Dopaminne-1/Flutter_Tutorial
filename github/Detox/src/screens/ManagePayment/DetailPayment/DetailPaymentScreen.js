import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import {
  PaymentUnit,
  TransactionPaymentStatus,
  TransactionServiceType,
  TransactionType as PaymentTransactionType,
  useGetAgentDetailLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {getUserId, isAgent} from '../../../appData/user/selectors';
import {
  APP_CURRENCY,
  FETCH_POLICY,
  NOT_ANS,
  PAYMENT_UNITS,
  TransactionServices,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import ScrollViewRefresh from '../../../components/ScrollViewRefresh';
import ArrayUtils from '../../../utils/ArrayUtils';
import NumberUtils from '../../../utils/NumberUtils';
import {getTextDateFromTimeStamp, getTransactionDateTimeString} from '../../../utils/TimerCommon';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import TextTitleInfo from '../../Transaction/components/TextTitleInfo';
import {TransactionType} from '../../Transaction/DetailTransaction/Components/DetailTransactionConstant';
import GetMappedPaymentDetail from '../hooks/useGetMappedPaymentDetail';
import GetMappedRefundDetail from '../hooks/useGetMappedRefundDetail';
import ManagePaymentFilterUtil from '../ManagePaymentFilterUtil';

const styles = StyleSheet.create({
  viewContainer: {
    ...METRICS.horizontalPadding,
    marginTop: 0,
    ...commonStyles.whiteBackground,
  },
  headerTitle: {
    ...FONTS.bold,
    color: COLORS.BLACK_33,
    fontSize: 21,
  },
  textBold14: {
    ...FONTS.bold,
    color: COLORS.BLACK_26,
    fontSize: 14,
  },
  text14: {
    color: COLORS.BLACK_26,
  },
  separator: {
    borderTopColor: COLORS.GREY_E4,
    borderTopWidth: 1,
  },
});

const mapBottomButtonTitle = serviceType => {
  switch (serviceType) {
    case TransactionServiceType.Subtype:
      return translate('payment.detail.viewTopenerInfo');
    case TransactionServiceType.Supportservicetype:
      return translate('payment.detail.requestDetail');
    default:
      return translate('transaction.title');
  }
};

const PaymentHistoryItem = ({data, showSeparator = false}) => {
  if (!data) {
    return null;
  }

  return (
    <View style={[METRICS.smallNormalVerticalPadding, showSeparator ? styles.separator : null]}>
      <Text>{getTransactionDateTimeString(data?.paidDatetime)}</Text>
      <View style={[HELPERS.rowSpaceBetweenCenter, METRICS.tinyMarginTop]}>
        <Text style={styles.text14}>{PAYMENT_UNITS[data?.paymentUnit].name}</Text>
        <Text style={styles.textBold14}>{`${NumberUtils.formatNumberToCurrencyNumber(
          data?.amount,
          0,
        )} ${APP_CURRENCY}`}</Text>
      </View>
    </View>
  );
};

const PaymentContextView = ({transactionInfo, histories, colorAndNameStatus, fundAccount}) => {
  const remainingAmount = transactionInfo?.expectedAmount - transactionInfo?.paidAmount;
  return (
    <>
      <View style={METRICS.marginTopPlus}>
        <Text style={styles.headerTitle}>{translate('common.paymentInfo')}</Text>
        <TextTitleInfo
          title={`${translate('common.state')}: `}
          des={colorAndNameStatus?.name}
          desStyle={[HELPERS.fill, {color: colorAndNameStatus?.color}]}
        />
        <TextTitleInfo
          title={`${translate('payment.paymentMethod')}: `}
          des={PAYMENT_UNITS[transactionInfo?.paymentUnit]?.name}
          desStyle={HELPERS.fill}
        />
        {transactionInfo?.paymentUnit === PaymentUnit.Fast && (
          <TextTitleInfo
            title={`${translate('payment.paymentCounter')}: `}
            des={fundAccount?.branchAddress}
            desStyle={HELPERS.fill}
          />
        )}
        <TextTitleInfo
          title={`${translate('common.paymentAmount')}: `}
          des={`${NumberUtils.formatNumberToCurrencyNumber(
            transactionInfo?.expectedAmount,
            0,
          )} ${APP_CURRENCY}`}
          desStyle={HELPERS.fill}
        />
        <TextTitleInfo
          title={`${translate('transaction.detail.paymentAmountPaid')}: `}
          des={`${NumberUtils.formatNumberToCurrencyNumber(
            transactionInfo?.paidAmount,
            0,
          )} ${APP_CURRENCY}`}
          desStyle={HELPERS.fill}
        />
        <TextTitleInfo
          title={`${translate('transaction.detail.paymentRemainingAmount')}: `}
          des={`${NumberUtils.formatNumberToCurrencyNumber(
            remainingAmount < 0 ? 0 : remainingAmount,
            0,
          )} ${APP_CURRENCY}`}
          desStyle={HELPERS.fill}
        />
        <TextTitleInfo
          title={`${translate(STRINGS.NOTE)}: `}
          des={transactionInfo?.paymentNotes}
          desStyle={HELPERS.fill}
        />
      </View>
      {ArrayUtils.hasArrayData(histories) && (
        <View style={METRICS.marginTopPlus}>
          <Text style={[styles.headerTitle, METRICS.marginBottom]}>
            {translate(STRINGS.PAYMENT_DETAIL)}
          </Text>
          {histories.map((item, index) => (
            <PaymentHistoryItem key={index} showSeparator={index !== 0} data={item} />
          ))}
        </View>
      )}
      {transactionInfo?.paymentUnit === PaymentUnit.Vnpay && transactionInfo?.paidAmount > 0 && (
        <View style={METRICS.marginTopPlus}>
          <Text style={[styles.headerTitle, METRICS.marginBottom]}>
            {translate(STRINGS.PAYMENT_DETAIL)}
          </Text>
          <PaymentHistoryItem
            showSeparator={false}
            data={{
              paidDatetime: transactionInfo?.paidDatetime,
              amount: transactionInfo?.paidAmount,
              paymentUnit: transactionInfo?.paymentUnit,
            }}
          />
        </View>
      )}
    </>
  );
};

const RefundContextView = ({transactionInfo, refundInfo, colorAndNameStatus}) => {
  const {customerInfo = {}, fundAccount, paidFundAccount} = refundInfo ?? {};
  const [cityName, setCityName] = useState('');
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();

  useEffect(() => {
    if (refundInfo?.cityId && refundInfo?.cityId > -1) {
      const cities = masterData?.cities?.edges ?? [];
      const city = cities.find(e => e.cityId === refundInfo?.cityId);

      setCityName(city?.cityName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refundInfo?.cityId, masterData]);
  return (
    <>
      <View style={METRICS.verticalMargin}>
        <Text style={styles.headerTitle}>{translate('payment.refundInfo')}</Text>
        <TextTitleInfo
          title={`${translate('common.state')}: `}
          des={colorAndNameStatus?.name}
          desStyle={[HELPERS.fill, {color: colorAndNameStatus?.color}]}
        />
        {transactionInfo?.transactionPaymentStatus === TransactionPaymentStatus.Refunded && (
          <>
            <TextTitleInfo
              title={`${translate('payment.refundedAmount')}: `}
              des={`${NumberUtils.formatNumberToCurrencyNumber(
                refundInfo?.refundAmount ?? 0,
                0,
              )} ${APP_CURRENCY}`}
              desStyle={HELPERS.fill}
            />
            <TextTitleInfo
              title={`${translate('payment.refundedDateTime')}: `}
              des={`${
                refundInfo?.refundDatetime
                  ? getTextDateFromTimeStamp(refundInfo?.refundDatetime)
                  : NOT_ANS
              }`}
              desStyle={HELPERS.fill}
            />
          </>
        )}
      </View>
      {transactionInfo?.paymentUnit === PaymentUnit.Fast && (
        <View>
          <Text style={styles.headerTitle}>{translate('transaction.refundAddress')}</Text>
          <TextTitleInfo
            title={`${translate('payment.refundOffice')}: `}
            des={fundAccount?.branchAddress ?? NOT_ANS}
            desStyle={HELPERS.fill}
          />

          <TextTitleInfo
            title={`${translate(STRINGS.NOTE)}: `}
            des={refundInfo?.notes}
            desStyle={HELPERS.fill}
          />
        </View>
      )}
      {transactionInfo?.paymentUnit === PaymentUnit.Bidv && (
        <View style={METRICS.marginBottom}>
          <Text style={styles.headerTitle}>{translate('payment.receiptAccount')}</Text>
          <TextTitleInfo
            title={`${translate(STRINGS.BANK)}: `}
            des={`${refundInfo?.bankInfo?.bankName} (${refundInfo?.bankInfo?.bankCode})`}
            desStyle={HELPERS.fill}
          />
          <TextTitleInfo
            title={`${translate(STRINGS.PROVINCE)}: `}
            des={cityName}
            desStyle={HELPERS.fill}
          />
          <TextTitleInfo
            title={`${translate('common.branch')}: `}
            des={refundInfo?.branchName ?? NOT_ANS}
            desStyle={HELPERS.fill}
          />
          <TextTitleInfo
            title={`${translate('common.accountName')}: `}
            des={refundInfo?.bankAccountName ?? NOT_ANS}
            desStyle={HELPERS.fill}
          />
          <TextTitleInfo
            title={`${translate('common.accountNumber')}: `}
            des={refundInfo?.bankAccountNo ?? NOT_ANS}
            desStyle={HELPERS.fill}
          />
          <TextTitleInfo
            title={`${translate(STRINGS.NOTE)}: `}
            des={refundInfo?.notes}
            desStyle={HELPERS.fill}
          />
        </View>
      )}
      <View style={METRICS.marginBottom}>
        <Text style={styles.headerTitle}>{translate(STRINGS.CUSTOMER_INFOR)}</Text>
        <TextTitleInfo
          title={`${translate(STRINGS.FULLNAME)}: `}
          des={`${customerInfo?.customerFirstName ?? ''} ${customerInfo?.customerLastName ?? ''}`}
          desStyle={HELPERS.fill}
        />
        <TextTitleInfo
          title={`${translate('common.email')}: `}
          des={customerInfo?.customerEmail}
          desStyle={HELPERS.fill}
        />
        <TextTitleInfo
          title={`${translate('common.phone')}: `}
          des={customerInfo?.customerPhone}
          desStyle={HELPERS.fill}
        />
        <TextTitleInfo
          title={`${translate('payment.paymentAmountPaid')}: `}
          des={`${NumberUtils.formatNumberToCurrencyNumber(
            refundInfo?.paidAmount ?? 0,
            0,
          )} ${APP_CURRENCY}`}
          desStyle={HELPERS.fill}
        />
        <TextTitleInfo
          title={`${translate('common.paymentMethod')}: `}
          des={PAYMENT_UNITS[transactionInfo?.paymentUnit]?.name}
          desStyle={HELPERS.fill}
        />
        {transactionInfo?.paymentUnit === PaymentUnit.Fast && (
          <TextTitleInfo
            title={`${translate('payment.paymentOffice')}: `}
            des={paidFundAccount?.branchAddress ?? NOT_ANS}
            desStyle={HELPERS.fill}
          />
        )}

        {transactionInfo?.paymentUnit === PaymentUnit.Vnpay && (
          <TextTitleInfo
            title={`${translate(STRINGS.NOTE)}: `}
            des={refundInfo?.notes}
            desStyle={HELPERS.fill}
          />
        )}
      </View>
    </>
  );
};

const mapServiceType = serviceType => {
  if (isEmpty(serviceType)) {
    return '';
  }
  return TransactionServices[serviceType]?.name ?? serviceType;
};

const DetailPaymentContainer = ({
  transactionInfo,
  histories,
  fundAccount,
  refundInfo,
  serviceType,
  onRefreshGetDetail,
  loading,
  hideButton = false,
  onPressBottomButton,
}) => {
  const isRefund = serviceType === TransactionServiceType.Refundtype;
  const isBuying =
    serviceType === TransactionServiceType.B2Ctype ||
    serviceType === TransactionServiceType.C2Ctype;
  const isSupportRequest = serviceType === TransactionServiceType.Supportservicetype;
  const isSubscription = serviceType === TransactionServiceType.Subscriptiontype;

  const disableButton = isRefund
    ? isEmpty(refundInfo?.transactionId)
    : isEmpty(transactionInfo?.transactionId) && serviceType === TransactionServiceType.B2Ctype;

  const colorAndNameStatus = ManagePaymentFilterUtil.getColorAndNameByStatus(
    transactionInfo?.transactionPaymentStatus,
  );

  let paidDatetime = transactionInfo?.paidDatetime
    ? getTransactionDateTimeString(transactionInfo?.paidDatetime)
    : NOT_ANS;

  if (isRefund) {
    paidDatetime = refundInfo?.paidDatetime
      ? getTransactionDateTimeString(refundInfo?.paidDatetime)
      : NOT_ANS;
  }

  return (
    <>
      <ScrollViewRefresh
        loading={loading}
        showCenterText={isEmpty(transactionInfo)}
        onRefresh={onRefreshGetDetail}>
        <View style={styles.viewContainer}>
          <View>
            <Text style={styles.headerTitle}>{transactionInfo?.productName}</Text>
            <TextTitleInfo
              title={`${translate('payment.detail.paymentCode')}: `}
              des={transactionInfo?.paymentTransferNumber}
              desStyle={HELPERS.fill}
            />
            <TextTitleInfo
              title={`${translate('payment.paymentService')}: `}
              des={mapServiceType(serviceType)}
              desStyle={HELPERS.fill}
            />
            <TextTitleInfo
              title={`${translate('payment.paymentDate')}: `}
              des={paidDatetime || NOT_ANS}
              desStyle={HELPERS.fill}
            />
          </View>
          {(isBuying || isSupportRequest || isSubscription) && (
            <PaymentContextView
              transactionInfo={transactionInfo}
              histories={histories}
              fundAccount={fundAccount}
              colorAndNameStatus={colorAndNameStatus}
            />
          )}
          {isRefund && (
            <RefundContextView
              transactionInfo={transactionInfo}
              refundInfo={refundInfo ?? {}}
              colorAndNameStatus={colorAndNameStatus}
            />
          )}
        </View>
      </ScrollViewRefresh>
      {!hideButton && (
        <View style={commonStyles.footerContainer}>
          <CustomButton
            style={disableButton ? commonStyles.disabledButtonConfirm : commonStyles.buttonConfirm}
            disabled={disableButton}
            title={mapBottomButtonTitle(serviceType)}
            titleStyle={FONTS.bold}
            onPress={onPressBottomButton}
          />
        </View>
      )}
    </>
  );
};

const DetailPaymentScreen = ({navigation, route}) => {
  const {
    userTransactionId,
    propertyPostId,
    transactionId,
    transactionType,
    transactionServiceType: serviceType,
    hideButton = false,
  } = route?.params || {};
  const userId = useSelector(getUserId);
  const isAgentUser = useSelector(isAgent);
  const [agentInfo, setAgentInfo] = useState({});

  const {getUserTransactionDetail, loading, transactionInfo, fundAccount, histories} =
    GetMappedPaymentDetail({
      serviceType,
    });

  const {
    getRefundDetail,
    loading: loadingRefund,
    transactionInfo: refundTransactionInfo,
    refundInfo,
  } = GetMappedRefundDetail({
    serviceType,
  });

  const onRefresh = () => {
    serviceType === TransactionServiceType.Refundtype
      ? getRefundDetail({transactionId, userTransactionId, transactionType, propertyPostId})
      : getUserTransactionDetail({userTransactionId, transactionType, propertyPostId});
  };

  const onSuccessGetAgentDetail = res => {
    if (res) {
      setAgentInfo(res);
    }
  };

  const {startApi: getAgentDetail} = useGraphqlApiLazy({
    graphqlApiLazy: useGetAgentDetailLazyQuery,
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    dataField: 'agentById',
    onSuccess: onSuccessGetAgentDetail,
  });

  useMount(() => {
    serviceType === TransactionServiceType.Refundtype
      ? getRefundDetail({transactionId, userTransactionId, transactionType, propertyPostId})
      : getUserTransactionDetail({userTransactionId, transactionType, propertyPostId});
    if (isAgentUser && serviceType === TransactionServiceType.Subtype) {
      getAgentDetail({variables: {agentId: userId}});
    }
  });

  const isLoading = serviceType === TransactionServiceType.Refundtype ? loadingRefund : loading;

  const transactionDetails =
    serviceType === TransactionServiceType.Refundtype ? refundTransactionInfo : transactionInfo;

  const isSubscription = serviceType === TransactionServiceType.Subscriptiontype;

  const onPressBottomButton = () => {
    let params;
    switch (serviceType) {
      case TransactionServiceType.Refundtype:
        params = {
          transactionId: refundInfo?.transactionId,
          transactionType:
            refundInfo?.transactionType === PaymentTransactionType.Booking
              ? TransactionType.Booking
              : TransactionType.Deposit,
          shouldRefresh: true,
          propertyPostId: transactionInfo?.propertyPostId,
        };
        navigation.navigate(ScreenIds.DetailTransaction, params);
        break;
      case TransactionServiceType.Subtype:
        if (isAgentUser) {
          navigation.navigate(ScreenIds.UpdateAgentProfile, {
            agentById: agentInfo?.agentById,
            isEditRefCode: isEmpty(agentInfo?.agentById?.referralCode),
          });
        } else {
          navigation.navigate(ScreenIds.RegisterAgent);
        }
        break;
      case TransactionServiceType.Supportservicetype:
        navigation.navigate(ScreenIds.DetailRequestSupport, {
          ticketId: transactionId,
        });
        break;
      case TransactionServiceType.Subscriptiontype:
        navigation.navigate(ScreenIds.CreateUpdateProfile);
        break;
      default:
        params = {
          transactionId: transactionInfo?.transactionId,
          propertyPostId: transactionInfo?.propertyPostId,
          transactionType:
            transactionInfo?.transactionType === PaymentTransactionType.Booking
              ? TransactionType.Booking
              : TransactionType.Deposit,
          shouldRefresh: true,
        };
        navigation.navigate(ScreenIds.DetailTransaction, params);
    }
  };

  return (
    <BaseScreen
      title={
        serviceType === TransactionServiceType.Refundtype
          ? translate(STRINGS.REFUND_REQUEST)
          : translate(STRINGS.PAYMENT_DETAIL)
      }
      testID={ScreenIds.DetailPayment}>
      <DetailPaymentContainer
        serviceType={serviceType}
        transactionInfo={transactionDetails}
        histories={histories}
        fundAccount={fundAccount}
        refundInfo={refundInfo}
        onRefreshGetDetail={onRefresh}
        loading={isLoading}
        hideButton={hideButton || isSubscription}
        onPressBottomButton={onPressBottomButton}
      />
    </BaseScreen>
  );
};

export default DetailPaymentScreen;
