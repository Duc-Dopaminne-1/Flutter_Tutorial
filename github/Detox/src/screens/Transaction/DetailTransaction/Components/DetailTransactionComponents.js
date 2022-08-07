import React from 'react';
import {StyleSheet, Text, TextStyle, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {normal, small, smallNormal, tiny} from '../../../../assets/theme/metric';
import CustomButton from '../../../../components/Button/CustomButton';
import LinkTextButton from '../../../../components/LinkTextButton';
import {CommonDetailTransactionStyles as commonStyles} from './DetailTransactionConstant';

type RowTextType = {
  text: string,
  customStyle: TextStyle,
};

const styles = StyleSheet.create({
  changeProduct: {
    paddingHorizontal: normal,
    paddingVertical: small,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: tiny,
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  viewButton: {...FONTS.bold, fontSize: 16, color: COLORS.NEUTRAL_WHITE},
  buttonHistory: {
    flex: 1,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
  },
  titleUpdate: {...FONTS.bold, fontSize: 16, color: COLORS.PRIMARY_A100},
  bottomView: {paddingVertical: normal, flexDirection: 'row', paddingHorizontal: normal},
  buttonUpdate: {flex: 1.5},
});
const SectionComponent = ({title, subTitle, rightViewFirstRow, children, isTitleActive = true}) => {
  const colorTitle = {color: isTitleActive ? COLORS.TEXT_DARK_10 : COLORS.GRAY_BD};

  return (
    <View style={commonStyles.sectionContainer}>
      <View style={commonStyles.firstRowContainer}>
        <View style={commonStyles.firstRowTitleAndTime}>
          <Text style={[commonStyles.title, colorTitle]}>{title}</Text>
          {subTitle ? <Text style={commonStyles.timeText}>{subTitle}</Text> : null}
        </View>
        {rightViewFirstRow}
      </View>
      {children}
    </View>
  );
};

const RowText = ({text, customStyle}: RowTextType) => {
  return <Text style={[commonStyles.rowValue, customStyle]}>{text}</Text>;
};

const SingleBottomButton = ({title, onPress, style, titleStyle, disabled = false}) => {
  return (
    <CustomButton
      style={style}
      titleStyle={[commonStyles.titleButtonDetail, titleStyle]}
      title={title}
      onPress={onPress}
      disabled={disabled}
    />
  );
};

const ButtonTransfer = ({data, onPress = () => {}}) => {
  if (data?.canTransferProperty) {
    return (
      <SingleBottomButton
        style={styles.changeProduct}
        titleStyle={{color: COLORS.PRIMARY_A100, ...FONTS.bold}}
        title={translate(STRINGS.TRANSFER_PRODUCT)}
        onPress={onPress}
      />
    );
  }
  if (data?.canShowButtonTransfer && data?.errorButtonTransfer) {
    return (
      <>
        <SingleBottomButton
          style={[styles.changeProduct, {borderColor: COLORS.TEXT_DARK_40}]}
          titleStyle={{color: COLORS.TEXT_DARK_40, ...FONTS.bold}}
          disabled={true}
          title={translate(STRINGS.TRANSFER_PRODUCT)}
          onPress={onPress}
        />
        <Text style={[commonStyles.errorText, {marginTop: small}]}>
          {data?.errorButtonTransfer}
        </Text>
      </>
    );
  }
  return null;
};

const ViewDeposited = ({data}) => {
  return (
    <>
      <Text>{`${translate(STRINGS.CONFIRMED_DEPOSIT_CODE)}:`}</Text>
      <LinkTextButton title={data.transactionCode} />
    </>
  );
};

const ViewTransferDeposited = ({data}) => {
  return data?.transferredDepositCode ? (
    <>
      <RowText text={`${translate(STRINGS.CONFIRMED_DEPOSIT_CODE)}:`} />
      <LinkTextButton title={`${data.transferredDepositCode}`} />
    </>
  ) : null;
};

const ViewBottom = ({data, onPressHistory, onPressUpdate}) => {
  return (
    <View style={styles.bottomView}>
      {data?.hasCustomerInfoChangeHistory && (
        <CustomButton
          style={[commonStyles.buttonNext, styles.buttonHistory]}
          title={translate('transaction.detail.updateHistory')}
          titleStyle={styles.titleUpdate}
          onPress={onPressHistory}
        />
      )}
      {data?.allowUpdateCustomer && (
        <CustomButton
          style={[
            commonStyles.buttonNext,
            styles.buttonUpdate,
            data?.hasCustomerInfoChangeHistory && {marginLeft: smallNormal},
          ]}
          title={translate('transaction.detail.updateInfoCustomer')}
          titleStyle={styles.viewButton}
          onPress={onPressUpdate}
        />
      )}
    </View>
  );
};

export {
  ButtonTransfer,
  RowText,
  SectionComponent,
  SingleBottomButton,
  ViewBottom,
  ViewDeposited,
  ViewTransferDeposited,
};
