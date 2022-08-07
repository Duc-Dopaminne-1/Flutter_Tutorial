import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import {PaymentUnit} from '../../../api/graphql/generated/graphql';
import {APP_CURRENCY, ManagePaymentStatus, TRANSACTION_MODE} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomFooterButtons from '../../../components/Button/CustomFooterButtons';
import TextView from '../../../components/TextView';
import Configs from '../../../configs';
import NumberUtils from '../../../utils/NumberUtils';
import {useMount} from '../../commonHooks';
import PropertyType from '../../ManagePost/PropertyType';
import ScreenIds from '../../ScreenIds';
import TransactionPaymentView from '../../Transaction/components/TransactionPaymentView';
import {TransactionType} from '../../Transaction/DetailTransaction/Components/DetailTransactionConstant';
import {TrackingActions} from '../../WithSegment';
import {BookingContext} from '../useBooking';

const PAYMENT_METHOD_TITLE = {
  [PaymentUnit.Fast]: translate('common.cash'),
  [PaymentUnit.Bidv]: translate('common.transferByBankAccount'),
  [PaymentUnit.Vnpay]: translate('common.VNpay'),
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingTop: 32,
  },
  payLogo: {
    width: '100%',
    height: 152,
  },
  infoContainer: {
    marginTop: 24,
  },
  sectionHeaderText: {
    ...FONTS.fontSize16,
    ...FONTS.bold,
    color: COLORS.BLACK_33,
  },
  infoText: {
    ...FONTS.fontSize14,
    ...FONTS.regular,
    color: COLORS.BLACK_33,
    textAlign: 'justify',
  },
});

const ProductInfo = ({info}) => {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.sectionHeaderText}>{translate(STRINGS.PRODUCT_INFORMATION)}</Text>
      <View style={commonStyles.separatorRow12} />
      <TextView
        title={translate(STRINGS.PROJECT_NAME) + ':'}
        containerStyle={HELPERS.mainSpaceBetween}
        value={info?.projectName || '-'}
        valueLines={2}
      />
      <View style={commonStyles.separatorRow12} />
      <TextView
        title={translate(STRINGS.PRODUCT_CODE) + ':'}
        containerStyle={HELPERS.mainSpaceBetween}
        value={info?.productCode || '-'}
      />
      {info?.isApartment && (
        <>
          <View style={commonStyles.separatorRow12} />
          <TextView
            title={translate(STRINGS.FLOOR) + ':'}
            containerStyle={HELPERS.mainSpaceBetween}
            value={info?.floor || '-'}
          />
        </>
      )}
      <View style={commonStyles.separatorRow12} />
      <TextView
        title={translate(info?.isApartment ? STRINGS.BLOCK : STRINGS.SUB_AREA) + ':'}
        containerStyle={HELPERS.mainSpaceBetween}
        value={info?.block || '-'}
      />
    </View>
  );
};

const PaymentStatusInfo = ({info, paymentInfo}) => {
  const paymentStatus = info?.paymentStatus;
  const paymentStatusColor = {
    color: paymentStatus.color,
  };
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.sectionHeaderText}>{translate('common.paymentInfo')}</Text>
      <View style={commonStyles.separatorRow12} />
      <TextView
        title={translate('common.paymentCode') + ':'}
        containerStyle={HELPERS.mainSpaceBetween}
        value={info?.paymentCode || '-'}
      />
      <View style={commonStyles.separatorRow12} />
      {info?.paymentUnit === PaymentUnit.Fast && (
        <>
          <TextView
            title={translate('common.amount') + ':'}
            containerStyle={HELPERS.mainSpaceBetween}
            value={
              paymentInfo?.expectedAmount
                ? `${NumberUtils.formatNumberToCurrencyNumber(
                    paymentInfo?.expectedAmount,
                    0,
                  )} ${APP_CURRENCY}` ?? ''
                : '-'
            }
          />
          <View style={commonStyles.separatorRow12} />
        </>
      )}
      <TextView
        title={translate('common.paymentMethod') + ':'}
        containerStyle={HELPERS.mainSpaceBetween}
        customRightComponent={
          <View style={[HELPERS.row, HELPERS.mainEnd]}>
            <Text style={styles.infoText}>{info?.paymentMethodDescription || '-'}</Text>
          </View>
        }
      />
      <View style={commonStyles.separatorRow12} />
      <TextView
        title={translate(STRINGS.STATUS) + ':'}
        containerStyle={HELPERS.mainSpaceBetween}
        valueStyle={paymentStatusColor}
        value={paymentStatus.name || '-'}
      />
    </View>
  );
};

const TransactionInfo = ({state, navigation}) => {
  const paymentUnit = state?.transactionStatus?.paymentUnit;
  const isPayWithCash = paymentUnit === PaymentUnit.Fast;
  const transactionInstruction = isPayWithCash
    ? translate('transaction.transactionCashInstruction')
    : translate('transaction.transactionTransferInstruction');
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>{transactionInstruction}</Text>
      <View style={commonStyles.separatorRow12} />
      {paymentUnit !== PaymentUnit.Vnpay && (
        <TransactionPaymentView
          paymentUnit={state?.transactionStatus?.paymentUnit}
          bankTransferDetail={state?.paymentInfo}
          cashTransferDetail={state?.fundAccount}
          navigation={navigation}
        />
      )}
    </View>
  );
};

const PaymentInfoScreen = ({route, navigation}) => {
  const {paymentInfo} = route?.params;
  const {track} = useAnalytics();
  const {
    bankAccountName,
    bankAccountNumber,
    bankTransferContents,
    expectedAmount,
    transactionPaymentStatus,
    paymentUnit,
    transactionId,
    fundAccount,
    paymentCode,
    paidAmount,
  } = paymentInfo ?? {};
  const {state: moduleState} = useContext(BookingContext);
  const {projectStatus, detailPath} = moduleState.project;
  const {propertyPost} = moduleState;

  useMount(() => {
    track(TrackingActions.projectOrderSucceeded, {
      page_url: `${Configs.portal.PORTAL_URL}${detailPath ?? ''}`,
      transaction_code: paymentCode ?? bankAccountNumber ?? '',
      transaction_type:
        projectStatus === TRANSACTION_MODE.BOOKING
          ? TransactionType.Booking
          : TransactionType.Deposit,
      transaction_amount: paidAmount ?? 0,
      property_id: propertyPost.propertyCode ?? '',
      project_status: propertyPost.projectStatusDescription ?? '',
      project_name: propertyPost.projectName ?? '',
      property_image: JSON.stringify(propertyPost?.images[0]) ?? '',
      property_sale_price: propertyPost.rawPrice ?? 0,
      commission: propertyPost.commission ?? '',
      booking_count: `${propertyPost.numberOfBooking ?? '0'}`,
      property_type: propertyPost.propertyTypeDescription ?? '',
      property_block: propertyPost.blockName ?? '',
      floor: propertyPost.floor ?? '',
      direction: propertyPost.direction ?? '',
      bedroom_number: `${propertyPost.numberOfBedrooms ?? 0}`,
      bathroom_number: `${propertyPost.numberOfBathrooms ?? 0}`,
      builtup_area: propertyPost.buildingArea ?? '',
      carpet_area: propertyPost.capetArea ?? '',
      mininmum_payment: propertyPost.rawBookingFee ?? 0,
    });
  });

  const [state] = useState({
    transactionStatus: {
      paymentCode: bankAccountNumber ?? paymentCode ?? '',
      paymentMethodDescription: PAYMENT_METHOD_TITLE[paymentUnit],
      paymentUnit: paymentUnit,
      paymentStatus: ManagePaymentStatus[transactionPaymentStatus],
      transactionPaymentStatus: transactionPaymentStatus,
    },
    paymentInfo: {
      bankAccountName: bankAccountName ?? '',
      bankAccountNumber: bankAccountNumber ?? '',
      bankTransferContents: bankTransferContents ?? '',
      expectedAmount: expectedAmount,
    },
    transactionInfo: {
      transactionId: transactionId,
      transactionType:
        projectStatus === TRANSACTION_MODE.BOOKING
          ? TransactionType.Booking
          : TransactionType.Deposit,
      transactionCode: null,
    },
    productInfo: {
      projectName: moduleState.propertyPost?.projectName,
      productCode: moduleState.propertyPost?.propertyCode,
      floor: moduleState.propertyPost?.floor,
      block: moduleState.propertyPost?.blockName,
      isApartment: moduleState?.propertyPost?.propertyTypeName === PropertyType.apartment,
    },
    fundAccount: fundAccount,
  });

  const onPressBuyMore = () => {
    navigation.navigate(ScreenIds.ProjectDetail);
  };

  const onReviewTransaction = () => {
    navigation.navigate(ScreenIds.Transaction);
    navigation.navigate(ScreenIds.DetailTransaction, {
      transactionId: state.transactionInfo.transactionId,
      transactionType: state.transactionInfo.transactionType,
      transactionCode: state.transactionInfo.transactionCode,
      propertyPostId: propertyPost?.propertyPostId,
    });
  };

  const noResponse = () => {};

  return (
    <BaseScreen testID={ScreenIds.PaymentInfo} showHeader={false} onBackPress={noResponse}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={METRICS.horizontalPadding}>
          <Image source={IMAGES.IC_PAY_WITH_PHONE} style={styles.payLogo} resizeMode="contain" />
          <ProductInfo info={state.productInfo} />
          <PaymentStatusInfo info={state.transactionStatus} paymentInfo={state.paymentInfo} />
          <TransactionInfo state={state} navigation={navigation} />
        </View>
        <View style={commonStyles.separatorRow24} />
      </ScrollView>
      <View style={commonStyles.footerContainer}>
        <CustomFooterButtons
          cancelButtonTitle={translate('common.buyMore')}
          nextButtonTitle={translate('transaction.review')}
          onPressCancel={onPressBuyMore}
          onPressNext={onReviewTransaction}
        />
      </View>
    </BaseScreen>
  );
};

export default PaymentInfoScreen;
