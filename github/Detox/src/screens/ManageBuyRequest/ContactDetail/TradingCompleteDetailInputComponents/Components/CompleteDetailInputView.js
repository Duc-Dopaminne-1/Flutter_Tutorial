import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {TotalComissionUnit} from '../../../../../api/graphql/generated/graphql';
import {APP_CURRENCY, MAX_LENGTH} from '../../../../../assets/constants';
import {IMAGES} from '../../../../../assets/images';
import {translate} from '../../../../../assets/localize';
import {STRINGS} from '../../../../../assets/localize/string';
import {COLORS} from '../../../../../assets/theme/colors';
import {FONTS} from '../../../../../assets/theme/fonts';
import {HELPERS} from '../../../../../assets/theme/helpers';
import {METRICS} from '../../../../../assets/theme/metric';
import {commonStyles} from '../../../../../assets/theme/styles';
import InputSection from '../../../../../components/InputSection';
import TextView from '../../../../../components/TextView';
import NumberUtils from '../../../../../utils/NumberUtils';
import {getDatePickerDateString} from '../../../../../utils/TimerCommon';
import PropertyPostUtils from '../../../../ManagePost/PropertyPostUtils';
import ImagePicker from '../../TradingDepositDetailInputComponents/Components/UploadImagesComponent';

const styles = StyleSheet.create({
  // Text
  header: {
    fontSize: 20,
    ...FONTS.bold,
    color: COLORS.BLACK_31,
  },
  txtInput: {
    ...commonStyles.txtFontSize14,
    color: COLORS.BLACK_33,
  },
  inputTitle: {
    ...FONTS.regular,
    ...commonStyles.txtFontSize14,
    color: COLORS.BRAND_GREY,
  },
  textProductValue: {
    ...HELPERS.fill,
    ...FONTS.regular,
    ...FONTS.fontSize14,
    alignSelf: 'flex-end',
    color: COLORS.BLACK_31,
  },
  titleProductValue: {
    ...FONTS.fontSize14,
    ...FONTS.regular,
    color: COLORS.GRAY_A3,
  },
  primaryColorText: {
    color: COLORS.PRIMARY_A100,
  },

  // Container
  bodyContainer: {
    ...METRICS.horizontalPadding,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  sectionContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  textInputConsultNote: {
    ...commonStyles.multilineInput,
    ...METRICS.horizontalPadding,
  },
});

const mapInfo = (value, format) => {
  if (!value) {
    return '--';
  }
  return format(value);
};

const mapCurrency = value =>
  `${NumberUtils.formatNumberToCurrencyNumber(value, 0)} ${APP_CURRENCY}`;

const mapComission = value =>
  PropertyPostUtils.parseCommission(value, null, TotalComissionUnit.Bypercentage);

const CompleteDetailInputView = ({
  photoViewer,
  propertyCode,
  contractPrice,
  contractNote,
  comission,
  consultantComission,
  sellerComission,
  propertyPrice,
  signedDate,
  organizerComission,
  buyerComission,
  totalComission,
  attachment,
}) => {
  return (
    <View style={styles.bodyContainer}>
      <View style={styles.sectionContainer}>
        <Text style={styles.header}>{`${translate(
          STRINGS.PROPERTY_CODE_DESC,
        )}: #${propertyCode}`}</Text>
        <View style={commonStyles.separatorRow16} />
        <Text style={styles.titleProductValue}>{translate(STRINGS.FINAL_PRICE_BDS)}:</Text>
        <View style={commonStyles.separatorRow4} />
        <Text style={[styles.header, styles.primaryColorText]}>
          {mapInfo(contractPrice, mapCurrency)}
        </Text>
        <View style={commonStyles.separatorRow4} />
        <Text style={styles.txtInput}>{NumberUtils.mapNumberToWord(contractPrice)}</Text>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.header}>{`${translate(STRINGS.TRANSACTION_INFO)}`}</Text>
        <View style={commonStyles.separatorRow16} />
        <TextView
          title={`${translate('contactTrading.complete.comissionPercentage')}:`}
          titleStyle={styles.titleProductValue}
          customRightComponent={
            <View style={[HELPERS.fill, HELPERS.crossEnd]}>
              <Text style={styles.textProductValue}> {mapInfo(comission, mapComission)}</Text>
            </View>
          }
        />
        <View style={commonStyles.separatorRow8} />
        <TextView
          title={`${translate(STRINGS.TOTAL_COMMISSION)}:`}
          titleStyle={styles.titleProductValue}
          customRightComponent={
            <View style={[HELPERS.fill, HELPERS.crossEnd]}>
              <Text style={styles.textProductValue}>{mapInfo(totalComission, mapCurrency)}</Text>
            </View>
          }
        />
        <View style={commonStyles.separatorRow8} />
        <TextView
          title={`${translate('contactTrading.complete.topenerBuyerComission')}:`}
          titleStyle={styles.titleProductValue}
          customRightComponent={
            <View style={[HELPERS.fill, HELPERS.crossEnd]}>
              <Text style={styles.textProductValue}>{mapInfo(buyerComission, mapCurrency)}</Text>
            </View>
          }
        />
        <View style={commonStyles.separatorRow8} />
        <TextView
          title={`${translate('contactTrading.complete.transactionInfo.platformFee')}:`}
          titleStyle={styles.titleProductValue}
          customRightComponent={
            <View style={[HELPERS.fill, HELPERS.crossEnd]}>
              <Text style={styles.textProductValue}>
                {mapInfo(organizerComission, mapCurrency)}
              </Text>
            </View>
          }
        />
        <View style={commonStyles.separatorRow8} />
        <TextView
          title={`${translate(STRINGS.TRANSACTION_DATE)}:`}
          titleStyle={styles.titleProductValue}
          customRightComponent={
            <View style={[HELPERS.fill, HELPERS.crossEnd]}>
              <Text style={styles.textProductValue}>{getDatePickerDateString(signedDate)}</Text>
            </View>
          }
        />
        <View style={commonStyles.separatorRow8} />
        <TextView
          title={`${translate('contactTrading.complete.propertySellPrice')}:`}
          titleStyle={styles.titleProductValue}
          customRightComponent={
            <View style={[HELPERS.fill, HELPERS.crossEnd]}>
              <Text style={styles.textProductValue}>{mapInfo(propertyPrice, mapCurrency)}</Text>
            </View>
          }
        />
        <View style={commonStyles.separatorRow8} />
        <TextView
          title={`${translate('contactTrading.complete.topenerSellerComission')}:`}
          titleStyle={styles.titleProductValue}
          customRightComponent={
            <View style={[HELPERS.fill, HELPERS.crossEnd]}>
              <Text style={styles.textProductValue}>{mapInfo(sellerComission, mapCurrency)}</Text>
            </View>
          }
        />
        <View style={commonStyles.separatorRow8} />
        <TextView
          title={`${translate('contactTrading.complete.consultantComission')}:`}
          titleStyle={styles.titleProductValue}
          customRightComponent={
            <View style={[HELPERS.fill, HELPERS.crossEnd]}>
              <Text style={styles.textProductValue}>
                {mapInfo(consultantComission, mapCurrency)}
              </Text>
            </View>
          }
        />
        <View style={commonStyles.separatorRow32} />
        <InputSection
          headerTitle={translate(STRINGS.NOTE) + ':'}
          headerStyles={styles.inputTitle}
          inputStyle={styles.textInputConsultNote}
          value={contractNote}
          multiline
          showMultilineInputView
          showLimitedLength
          maxLength={MAX_LENGTH.NOTE}
          editable={false}
        />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.header}>{`${translate(
          'contactTrading.complete.attachmentFile',
        )}`}</Text>
        {attachment && attachment?.length > 0 ? (
          <View style={METRICS.verticalMargin}>
            <ImagePicker
              defaultImages={attachment ?? []}
              buttonTitle={translate(STRINGS.UPLOAD_DOCUMENT)}
              icon={IMAGES.UPLOAD_FILL}
              pickerTitle={translate(STRINGS.PICK_PICTURE)}
              onPressImage={index => photoViewer.onPressImage(index)}
              isShowOnly
              hideCloseButton
            />
          </View>
        ) : (
          <View style={[HELPERS.fillCenter, METRICS.tinyMarginTop]}>
            <Image source={IMAGES.IMG_EMPTY_FILE} />
            <View style={commonStyles.separatorRow12} />
            <Text style={[styles.textProductValue, HELPERS.selfCenter]}>
              {translate('contactTrading.complete.noFileAttached')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CompleteDetailInputView;
