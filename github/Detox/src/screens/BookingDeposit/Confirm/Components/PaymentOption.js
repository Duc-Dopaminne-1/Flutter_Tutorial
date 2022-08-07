import isEmpty from 'lodash/isEmpty';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import {PaymentMethod} from '../../../../api/graphql/generated/graphql';
import {NOT_ANS, TRANSACTION_MODE} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {normal, small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import AgreementBookingDeposit from '../../../../components/AgreementBookingDeposit';
import CustomCheckbox from '../../../../components/Checkbox/CustomCheckbox';
import ArrayUtils from '../../../../utils/ArrayUtils';
import {downloadFile, fileEndPoints} from '../../../../utils/fileHandler';
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

const agreementInfo = projectStatus => {
  if (projectStatus === TRANSACTION_MODE.DEPOSIT) {
    return {
      fileName: 'XacNhanQuyenThamGiaDatCoc',
      textDownloadFile: translate('agreement.fileDeposit'),
      endPoint: fileEndPoints.GET_DEPOSIT_TEMPLATE,
    };
  } else {
    return {
      fileName: 'XacNhanQuyenThamGiaDatCho',
      textDownloadFile: translate('agreement.fileBooking'),
      endPoint: fileEndPoints.GET_BOOKING_TEMPLATE,
    };
  }
};

const PaymentMethodItem = ({data, onChange = () => {}, selectedOffice, showPopup}) => {
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
                  {'\n\n'}
                  {translate('transaction.vnpayTransferNote2')}
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
const PaymentOption = ({
  state,
  isAgree,
  checkValue,
  projectStatus,
  onCheckAgreement,
  onChosenPaymentMethod = () => {},
  showPopup = () => {},
}) => {
  const onSelectMethod = id => {
    const newPaymentMethod = state?.paymentMethods.map(e => ({
      ...e,
      checked: e.id === id,
      visible: e.id === id,
    }));
    onChosenPaymentMethod(newPaymentMethod);
  };

  const [selectedOffice, setSelectedOffice] = useState(null);

  const agreementData = agreementInfo(projectStatus);

  useEffect(() => {
    if (ArrayUtils.hasArrayData(state?.topenLandOffices)) {
      const arrData = [...state?.topenLandOffices];
      const selectedItem = arrData.find(item => item?.checked === true);
      setSelectedOffice(selectedItem);
    } else {
      setSelectedOffice(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.topenLandOffices]);

  return (
    <>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.paymentMethodScrollView}>
          {state?.paymentMethods?.map((e, index) => (
            <PaymentMethodItem
              key={index}
              data={e}
              onChange={onSelectMethod}
              showPopup={showPopup}
              selectedOffice={selectedOffice}
            />
          ))}
        </ScrollView>
        <View style={commonStyles.separatorRow12} />
        <AgreementBookingDeposit
          isAgree={isAgree}
          checkValue={checkValue}
          sectionTitle={translate('agreement.sectionTitle')}
          documentText={agreementData.textDownloadFile}
          termsAndPolicyText={translate('agreement.policyAndCondition')}
          acceptTermText={translate('agreement.acceptTermText')}
          onPressTermsAndPolicy={onCheckAgreement}
          onDocumentDownload={() =>
            downloadFile({
              fileName: agreementData.fileName,
              endPoint: agreementData.endPoint,
              fileExtension: 'pdf',
            })
          }
        />
      </View>
    </>
  );
};

export default PaymentOption;
