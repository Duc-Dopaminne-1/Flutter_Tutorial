import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CONSTANTS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {IMAGES} from '../assets/images';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS, smallNormal, tiny} from '../assets/theme/metric';
import CustomCheckbox from './Checkbox/CustomCheckbox';
import DocumentItem from './DocumentItem';

export const AgreementDocumentDownload = ({
  title = '',
  containerStyles = {},
  onPress = () => {},
}) => {
  return (
    <View style={[HELPERS.row, containerStyles]}>
      <Image source={IMAGES.IC_DOCUMENT} style={styles.iconDocument} resizeMode="contain" />
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.contractDocumentText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const AgreementBookingDeposit = ({
  checkValue,
  isAgree,
  sectionTitle = '',
  documentText = '',
  termsAndPolicyText = '',
  acceptTermText = '',
  onDocumentDownload = () => {},
  onConfirm = () => {},
  onPressTermsAndPolicy = () => {},
}) => {
  return (
    <View>
      <Text style={styles.titleText}>{sectionTitle}</Text>
      <View style={[METRICS.smallVerticalMargin]}>
        <DocumentItem
          containerStyle={styles.documentFile}
          key={documentText}
          name={documentText}
          onPress={onDocumentDownload}
        />
        <View style={{height: SIZES.SEPARATOR_8}} />
        <DocumentItem
          icon={IMAGES.IC_LINK_FILL}
          containerStyle={styles.documentFile}
          hideRightIcon
          key={termsAndPolicyText}
          name={termsAndPolicyText}
          onPress={onPressTermsAndPolicy}
        />
      </View>

      <View style={[HELPERS.row, styles.body]}>
        <CustomCheckbox
          parentCheckedValue={isAgree}
          checkValue={checkValue}
          style={styles.checkBox}
          hitSlop={CONSTANTS.HIT_SLOP_HORIZONTAL}
          onChange={onConfirm}
        />
        <Text style={[HELPERS.rowWrap, METRICS.smallHorizontalMargin, styles.agreement]}>
          <Text style={styles.label}>{acceptTermText}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...FONTS.regular,
    fontSize: 14,
  },
  body: {
    paddingVertical: tiny,
  },
  checkBox: {
    width: 30,
    height: 30,
  },
  agreement: {
    flex: 1,
    textAlign: 'justify',
  },
  titleText: {
    fontSize: 20,
    ...FONTS.bold,
  },
  iconDocument: {
    width: 16,
    height: 16,
  },
  contractDocumentText: {
    ...FONTS.regular,
    ...FONTS.fontSize14,
    textDecorationLine: 'underline',
    color: COLORS.PRIMARY_A100,
    marginHorizontal: smallNormal,
  },
  documentFile: {
    paddingHorizontal: 8,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.NEUTRAL_BORDER,
  },
});

export default AgreementBookingDeposit;
