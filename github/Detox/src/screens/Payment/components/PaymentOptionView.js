import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import {PaymentMethod, TransactionType} from '../../../api/graphql/generated/graphql';
import {NOT_ANS} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import AgreementComponent from '../../../components/AgreementComponent';
import CustomCheckbox from '../../../components/Checkbox/CustomCheckbox';
import SelectionOfficeView from './SelectionOfficeView';

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: normal},
  disabledText: {color: COLORS.GREY_CB},
  bankLogoContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: 7,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bankLogoImage: {
    width: 77,
    height: 30,
  },
  chosenBankChecked: {
    position: 'absolute',
    zIndex: 1,
    right: 4,
    top: 4,
  },
  transferNoteSection: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: 12,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.GREY_E4,
  },
  textBold: {
    fontWeight: 'bold',
  },
  textTransferNote: {
    ...FONTS.fontSize14,
    ...FONTS.regular,
    color: COLORS.BLACK_33,
    textAlign: 'justify',
  },
  paymentMethodScrollView: {
    flexGrow: 1,
  },
});

const images = ['radiobox-marked', 'radiobox-blank'];

const PaymentMethodItem = ({
  data,
  onChange = () => {},
  selectedOffice,
  showPopup,
  transactionType,
}) => {
  const textPoliceNote = translate('transaction.transferPoliceCompleteNote');
  return (
    <>
      <CustomCheckbox
        title={data?.title}
        description={data?.description}
        images={images}
        parentCheckedValue={data?.checked}
        shouldGetValueOutSide
        onChange={() => onChange(data?.id)}
        style={{marginTop: normal + small}}
        descriptionStyle={styles.disabledText}
        iconColor={COLORS.GREY_CB}
      />
      {data?.checked && (
        <>
          {data?.paymentMethod === PaymentMethod.Banktransfer && (
            <>
              <View style={commonStyles.separatorRow12} />
              <View style={styles.transferNoteSection}>
                <Text style={[styles.textTransferNote, styles.textBold]}>
                  {translate('common.paymentInstruction')}:
                </Text>
                <View style={commonStyles.separatorRow12} />
                <Text style={styles.textTransferNote}>
                  {translate('transaction.nationalBankTransferNote1')}
                </Text>
                <View style={commonStyles.separatorRow12} />
                <Text style={styles.textTransferNote}>
                  {translate('transaction.nationalBankTransferNote2')}
                </Text>
                <View style={commonStyles.separatorRow12} />
                <Image
                  source={IMAGES.LOGO_BIDV}
                  style={styles.bankLogoImage}
                  resizeMode="contain"
                />
                <View style={commonStyles.separatorRow4} />
                <Text style={[styles.textTransferNote, styles.textBold]}>
                  {translate('payment.bidvBankingTitle2')}
                </Text>
                <View style={commonStyles.separatorRow12} />
                <Text style={styles.textTransferNote}>
                  {translate('transaction.nationalBankTransferNote3')}
                </Text>
                <View style={commonStyles.separatorRow12} />
                <Text style={styles.textTransferNote}>
                  {translate('transaction.nationalBankTransferNote4')}
                </Text>
              </View>
            </>
          )}
          {data?.paymentMethod === PaymentMethod.Ewallet && (
            <>
              <View style={commonStyles.separatorRow12} />
              <View style={styles.transferNoteSection}>
                <Text style={styles.textTransferNote}>
                  {translate('transaction.vnpayTransferNote')}
                  {transactionType !== TransactionType.Supportservice && (
                    <Text>
                      {'\n\n'}
                      {translate('transaction.vnpayTransferNote2')}
                    </Text>
                  )}
                </Text>
              </View>
            </>
          )}
          {data?.paymentMethod === PaymentMethod.Cash && (
            <>
              <SelectionOfficeView
                placeholder={translate('transaction.pleaseChoosePaymentAddress')}
                inputStyle={commonStyles.dropdownInput}
                dropdownPlaceHolderStyle={commonStyles.dropdownPlaceHolder}
                emptyText={translate(STRINGS.DO_NOT_HAVE_DATA)}
                item={selectedOffice}
                onPress={showPopup}
              />
              <View style={commonStyles.separatorRow12} />
              {selectedOffice && (
                <View style={styles.transferNoteSection}>
                  <Text style={styles.textTransferNote}>
                    {translate('transaction.paymentNotice1')}
                    {`\n${translate('transaction.paymentNote1')}`}
                    {translate('common.paymentCode')} {translate('transaction.paymentNote2')}"
                    {translate(STRINGS.CONFIRM)}" {translate('transaction.paymentNote3')}
                    {`\n\n2. ${textPoliceNote}`}
                    {translate('transaction.fastTransferNote')}
                    {translate('payment.cashPaymentTimeout')}
                    {translate('transaction.fastTransferNote2')}
                  </Text>
                  <Text style={styles.textTransferNote}>
                    {'\n'}
                    {isEmpty(selectedOffice?.branchName)
                      ? NOT_ANS
                      : selectedOffice?.branchName}{' '}
                    {`\n${translate(STRINGS.ADDRESS)}: `}
                    <Text style={styles.textBold}>
                      {`${
                        isEmpty(selectedOffice?.branchAddress)
                          ? NOT_ANS
                          : selectedOffice?.branchAddress
                      }`}
                    </Text>
                    {`\n${translate('common.phone')}: `}
                    <Text style={styles.textBold}>
                      {`${
                        isEmpty(selectedOffice?.phoneNumber) ? NOT_ANS : selectedOffice?.phoneNumber
                      }`}
                    </Text>
                    {`\n${translate('common.fax')}: `}
                    <Text style={styles.textBold}>
                      {`${
                        isEmpty(selectedOffice?.faxNumber) ? NOT_ANS : selectedOffice?.faxNumber
                      }`}
                    </Text>
                    {`\n${translate('common.email')}: `}
                    <Text style={styles.textBold}>
                      {`${
                        isEmpty(selectedOffice?.fundEmail) ? NOT_ANS : selectedOffice?.fundEmail
                      }\n`}
                    </Text>
                  </Text>
                </View>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

const getAgreementText = transactionType => {
  switch (transactionType) {
    case TransactionType.Supportservice:
      return {
        textFirst: translate('agreement.supportRequest.prefix'),
        suffix: translate('agreement.supportRequest.suffix'),
        hyperlink: translate('agreement.supportRequest.hyperlink'),
      };
    case TransactionType.Booking:
    case TransactionType.Deposit:
    default:
      return {
        textFirst: translate('agreement.agreeText'),
        suffix: translate('agreement.suffix'),
        hyperlink: translate('agreement.textTerm'),
      };
  }
};

const PaymentOption = ({
  transactionType,
  topenLandOffices = [],
  paymentMethods = [],
  isAgree,
  checkValue,
  onPressHyperLink,
  onChosenPaymentMethod = () => {},
  showPopup = () => {},
}) => {
  const agreementText = getAgreementText(transactionType);

  const onSelectMethod = id => {
    const newPaymentMethod = paymentMethods?.map(e => ({
      ...e,
      checked: e.id === id,
      visible: e.id === id,
    }));
    onChosenPaymentMethod(newPaymentMethod);
  };

  const selectedOffice = topenLandOffices?.find(item => item?.checked) ?? null;

  return (
    <>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.paymentMethodScrollView}>
          {paymentMethods?.map((e, index) => (
            <PaymentMethodItem
              key={index}
              data={e}
              onChange={onSelectMethod}
              showPopup={showPopup}
              selectedOffice={selectedOffice}
              transactionType={transactionType}
            />
          ))}
        </ScrollView>
        <View style={commonStyles.separatorRow12} />
        <AgreementComponent
          isAgree={isAgree}
          checkValue={checkValue}
          onConfirm={onPressHyperLink}
          {...agreementText}
        />
      </View>
    </>
  );
};

export default PaymentOption;
