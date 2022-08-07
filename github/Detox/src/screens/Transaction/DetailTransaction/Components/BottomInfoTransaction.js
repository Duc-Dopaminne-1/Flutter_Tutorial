import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {
  ConsultantInfoDto,
  PaymentUnit,
  TransactionServiceType,
  Transation_CustomerInfoDto,
} from '../../../../api/graphql/generated/graphql';
import {
  APP_CURRENCY,
  GENDER_TYPE,
  ManagePaymentStatus,
  NOT_ANS,
  PAYMENT_UNITS,
} from '../../../../assets/constants';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS, normal, small} from '../../../../assets/theme/metric';
import {ChatButton, PhoneButton} from '../../../../components/Button/PhoneButton';
import LinkTextButton from '../../../../components/LinkTextButton';
import NumberUtils from '../../../../utils/NumberUtils';
import {getTransactionDateTimeString, timestampToDateString} from '../../../../utils/TimerCommon';
import PropertyType from '../../../ManagePost/PropertyType';
import {parsePlaceToString} from '../../../Profile/CreateEditProfile/BasicAgentProfileComponent';
import ScreenIds from '../../../ScreenIds';
import TextTitleInfo from '../../components/TextTitleInfo';
import TransactionPaymentView from '../../components/TransactionPaymentView';
import {TransactionType} from './DetailTransactionConstant';

const styles = StyleSheet.create({
  blockTitle: {
    ...FONTS.bold,
    color: COLORS.TEXT_DARK_10,
    fontSize: 21,
  },
  title: {
    color: COLORS.GRAY_97,
    fontSize: 14,
    flex: 1,
  },
  description: {
    flex: 2,
    color: COLORS.BLACK_33,
  },
  viewTextInfo: {
    flexDirection: 'row',
    marginTop: normal,
  },
  viewContain: {
    margin: normal,
    borderTopColor: COLORS.GREY_E4,
    borderTopWidth: 1,
    paddingTop: normal,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  rowRight: {
    flexDirection: 'row',
    flex: 2,
  },
  chatButton: {
    marginLeft: normal,
  },
});

type BottomInfoTransactionType = {
  customerInfo: Transation_CustomerInfoDto,
  projectName: string,
  consultant: ConsultantInfoDto,
  block: string,
  floor: string,
  code: string,
  contractDueDate: long,
};

const priceToText = price => {
  if (price >= 0) {
    return `${NumberUtils.formatNumberToCurrencyNumber(price, 0)} ${APP_CURRENCY}`;
  }
  return '';
};

export const mapDataToUi = ({data, paymentInfo}) => {
  const rawData = data.rawData;
  const priceAfterDiscount = data?.disCountInfo?.priceAfterDiscount ?? 0;
  const issuedPrice = data?.disCountInfo?.issuedPrice ?? 0;
  const dataTransaction: BottomInfoTransactionType = {
    projectName: data.projectName,
    code: data?.propertyCode,
    floor: data?.floor,
    block: data?.blockName,
    contractDueDate: rawData?.contractDueDate
      ? timestampToDateString(rawData?.contractDueDate)
      : false,
    transactionType: rawData?.transactionType,
    changeToTransaction: rawData?.changeToTransaction,
    customerInfo: data?.customerInfo,
    consultantInfo: rawData?.consultantInfo,
    propertyType: data?.propertyTypeName,
    paymentInfo: paymentInfo ?? {},
    paymentUnit: data?.paymentUnit,
    transactionCode: data?.transactionCode,
    propertyPostId: rawData?.propertyPostInfo?.propertyPostId,
    customerContactAddress: parsePlaceToString(rawData?.customerInfo?.customerContactAddress),
    permanentAddress: parsePlaceToString(rawData?.customerInfo?.permanentAddress),
    priorBookingInfo: data?.priorBookingInfo,
    buyCommission: `${rawData?.buyCommission ?? 0}%`,
    disCountInfo: data?.disCountInfo
      ? {
          originalPrice: priceToText(issuedPrice),
          totalDiscount: priceToText(issuedPrice - priceAfterDiscount),
          finalPrice: priceToText(priceAfterDiscount),
        }
      : false,
    bookingTransactionId: rawData?.bookingTransactionId,
    priorBookingTransactionId: rawData?.priorBookingTransactionId,
  };
  return dataTransaction;
};

const ViewPropertyType = ({propertyType, block, floor}) => {
  const isApartment = propertyType === PropertyType.apartment;
  const title = isApartment ? STRINGS.TOWER : STRINGS.SUB_AREA;
  return (
    <>
      {isApartment ? <TextTitleInfo title={`${translate(STRINGS.FLOOR)}: `} des={floor} /> : null}
      <TextTitleInfo title={`${translate(title)}: `} des={block} />
    </>
  );
};

const BottomInfoTransaction = ({
  customerInfo,
  projectName,
  code,
  floor,
  block,
  consultantInfo,
  onPressProjectDetail,
  propertyType,
  paymentInfo,
  paymentUnit,
  transactionCode,
  contractDueDate,
  customerContactAddress = '',
  permanentAddress = ' ',
  buyCommission,
  priorBookingInfo,
  documentName,
  onPressDocument,
  onPressCallConsultant,
  onPressChatConsultant,
  navigation,
  disCountInfo,
  propertyPostId,
  priorBookingTransactionId,
  transactionType,
  changeToTransaction,
  bookingTransactionId,
}: BottomInfoTransactionType) => {
  const genderText =
    customerInfo?.gender === GENDER_TYPE.MALE ? translate(STRINGS.MALE) : translate(STRINGS.FEMALE);
  const paymentStatusObj = ManagePaymentStatus[paymentInfo?.transactionPaymentStatus];
  const expectedAmount = paymentInfo?.expectedAmount ?? 0;
  const paidAmount = paymentInfo?.paidAmount ?? 0;
  const remainingAmount = expectedAmount - paidAmount;
  const onPressViewDetail = () => {
    const transactionDetailType =
      priorBookingTransactionId || bookingTransactionId
        ? 'BOOKING'
        : transactionType?.toUpperCase();
    navigation.push(ScreenIds.DetailPayment, {
      userTransactionId: paymentInfo?.userTransactionId,
      transactionType: transactionDetailType,
      transactionServiceType: TransactionServiceType.B2Ctype,
      propertyPostId: changeToTransaction?.priorPropertyPostId || propertyPostId,
      hideButton: true,
    });
  };

  const onPressBookDetail = () => {
    navigation.push(ScreenIds.DetailTransaction, {
      transactionId: priorBookingInfo?.bookingTransactionId,
      transactionType: TransactionType.Booking,
      propertyPostId: changeToTransaction?.priorPropertyPostId || propertyPostId,
      shouldRefresh: true,
    });
  };

  const DetailButton = () => {
    const showView =
      NumberUtils.parseIntValue(paidAmount) > 0 && !isEmpty(paymentInfo?.userTransactionId);

    return showView ? (
      <TouchableOpacity style={[METRICS.marginStart, styles.icon]} onPress={onPressViewDetail}>
        <Image source={IMAGES.IC_VIEW} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>
    ) : null;
  };

  return (
    <View style={styles.viewContain}>
      <TextTitleInfo title={`${translate(STRINGS.TRANSACTION_CODE)}`} des={transactionCode} />
      <View style={{marginTop: normal}}>
        <Text style={styles.blockTitle}>{translate(STRINGS.PRODUCT_INFORMATION)}</Text>
        <View style={styles.viewTextInfo}>
          <Text style={styles.title}>{`${translate(STRINGS.PROJECT_NAME)}:`}</Text>
          <LinkTextButton
            onPress={onPressProjectDetail}
            style={styles.description}
            title={projectName}
          />
        </View>
        <TextTitleInfo title={`${translate(STRINGS.PRODUCT_CODE)}: `} des={code} />
        <ViewPropertyType propertyType={propertyType} block={block} floor={floor} />
        {contractDueDate && (
          <TextTitleInfo
            title={`${translate('transaction.detail.contractPeriod')}: `}
            des={contractDueDate}
          />
        )}
      </View>
      <TextTitleInfo
        title={`${translate('transaction.detail.buyCommission')}: `}
        des={buyCommission}
      />
      {disCountInfo && (
        <>
          <TextTitleInfo
            title={`${translate('transaction.detail.issuedPrice')}: `}
            des={disCountInfo?.originalPrice}
          />
          <TextTitleInfo
            title={`${translate('transaction.detail.totalDiscount')}: `}
            des={disCountInfo?.totalDiscount}
          />
          <View style={styles.viewTextInfo}>
            <Text style={styles.title}>{`${translate('transaction.detail.totalAmount')}:`}</Text>
            <Text style={[styles.description, {color: COLORS.PRIMARY_A100, ...FONTS.semiBold}]}>
              {disCountInfo?.finalPrice}
            </Text>
          </View>
        </>
      )}

      <View style={{marginVertical: normal}}>
        <Text style={styles.blockTitle}>{translate('transaction.detail.neederInfo')}</Text>
        <TextTitleInfo
          title={`${translate(STRINGS.CUSTOMER_FULLNAME)}: `}
          des={customerInfo?.customerFullName}
        />
        <TextTitleInfo title={`${translate('common.email')}: `} des={customerInfo?.customerEmail} />
        <TextTitleInfo
          title={`${translate('common.phone')}: `}
          des={customerInfo?.customerPhoneNumber}
        />
        <TextTitleInfo
          title={`${translate('common.identifyType')}: `}
          des={customerInfo?.nationalIdType}
        />
        <TextTitleInfo
          title={`${translate(STRINGS.IDENTIFY)}: `}
          des={customerInfo?.customerNationalId}
        />
        <TextTitleInfo
          title={`${translate(STRINGS.ID_ISSUE_DATE)}: `}
          des={customerInfo?.customerNationalIdIssueDate}
        />
        <TextTitleInfo
          title={`${translate(STRINGS.ID_ISSUE_PLACE)}: `}
          des={customerInfo?.customerNationalIdIssuePlace}
        />
        <TextTitleInfo
          title={`${translate(STRINGS.DAY_OF_BIRTH)}: `}
          des={customerInfo?.customerDob}
        />
        <TextTitleInfo title={`${translate(STRINGS.GENDER)}: `} des={genderText} />
        <TextTitleInfo title={`${translate(STRINGS.PERMANENT_ADDRESS)}: `} des={permanentAddress} />
        <TextTitleInfo
          title={`${translate(STRINGS.CONTACT_ADDRESS)}: `}
          des={customerContactAddress}
        />
      </View>

      <View>
        <Text style={styles.blockTitle}>{translate('transaction.detail.consultantInfo')}</Text>
        <TextTitleInfo
          title={translate('transaction.detail.consultantName')}
          des={consultantInfo?.fullName}
        />
        <TextTitleInfo title={`${translate('common.email')}: `} des={consultantInfo?.email} />
        <TextTitleInfo
          title={`${translate(STRINGS.PHONE_NUMBER)}: `}
          rightItem={
            <View style={styles.rowRight}>
              <PhoneButton onPress={onPressCallConsultant} />
              <ChatButton style={styles.chatButton} onPress={onPressChatConsultant} />
            </View>
          }
        />
      </View>
      {!isEmpty(paymentInfo) && (
        <>
          <View style={{marginVertical: normal}}>
            <Text style={styles.blockTitle}>{translate('common.paymentInfo')}</Text>
            {priorBookingInfo?.bookingCode && (
              <View style={styles.viewTextInfo}>
                <Text style={styles.title}>{`${translate(
                  'transaction.detail.priorBookingCode',
                )}:`}</Text>
                <LinkTextButton
                  onPress={onPressBookDetail}
                  style={styles.description}
                  title={priorBookingInfo?.bookingCode}
                />
              </View>
            )}
            <TextTitleInfo
              title={`${translate('transaction.detail.paymentCode')}: `}
              des={
                paymentInfo?.bankAccountNumber ??
                paymentInfo?.paymentCode ??
                paymentInfo?.vnpayAccountNumber ??
                ''
              }
            />
            <TextTitleInfo
              title={`${translate('payment.paymentMethod')}: `}
              des={PAYMENT_UNITS[paymentUnit]?.name}
            />
            <TextTitleInfo
              title={`${translate('common.state')}: `}
              des={paymentStatusObj?.name}
              desStyle={{color: paymentStatusObj?.color}}
            />
            <TextTitleInfo
              title={`${translate('common.paymentAmount')}: `}
              des={`${NumberUtils.formatNumberToCurrencyNumber(expectedAmount, 0)} VND`}
            />
            <TextTitleInfo
              title={`${translate('transaction.detail.paymentAmountPaid')}: `}
              des={`${NumberUtils.formatNumberToCurrencyNumber(paidAmount, 0)} VND`}
              subRightItem={<DetailButton />}
            />
            <TextTitleInfo
              title={`${translate('transaction.detail.paymentRemainingAmount')}: `}
              des={`${NumberUtils.formatNumberToCurrencyNumber(
                remainingAmount < 0 ? 0 : remainingAmount,
                0,
              )} VND`}
            />
            <TextTitleInfo
              title={`${translate(STRINGS.TRANSACTION_DATE)}: `}
              des={
                paymentInfo?.transactionDatetime
                  ? getTransactionDateTimeString(paymentInfo?.transactionDatetime)
                  : NOT_ANS
              }
            />
            <TextTitleInfo
              title={`${translate('payment.paymentDate')}: `}
              des={
                paymentInfo?.paidDatetime
                  ? getTransactionDateTimeString(paymentInfo?.paidDatetime)
                  : NOT_ANS
              }
            />
          </View>
          {paymentUnit !== PaymentUnit.Vnpay && (
            <TransactionPaymentView
              paymentUnit={paymentUnit}
              bankTransferDetail={paymentInfo}
              cashTransferDetail={paymentInfo?.fundAccount}
              navigation={navigation}
            />
          )}
        </>
      )}

      {!!documentName && (
        <View style={{marginVertical: normal}}>
          <Text style={styles.blockTitle}>{translate('transaction.detail.documentInfo')}</Text>
          <View style={[HELPERS.row, {paddingVertical: normal}]}>
            <Image style={{marginRight: small}} source={IMAGES.IC_DOWNFILE} />
            <LinkTextButton
              style={HELPERS.fill}
              textStyle={{color: COLORS.BOOKING_COMPLETED}}
              title={documentName}
              onPress={onPressDocument}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default BottomInfoTransaction;
