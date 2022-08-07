import React from 'react';
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {SizeBox} from '../../../components/SizeBox';

const Radio = ({checked}) => {
  return (
    <View
      style={{...styles.radio, borderColor: checked ? COLORS.PRIMARY_A100 : COLORS.NEUTRAL_BORDER}}>
      {checked && <View style={styles.subRadio} />}
    </View>
  );
};

const TextButton = ({text, onPress, textColor}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.paddingHor16}>
      <Text style={[styles.bold16, {color: textColor}]}>{text}</Text>
    </TouchableOpacity>
  );
};

const RowCenter = ({children, style}) => {
  return <View style={[styles.rowCenter, style]}>{children}</View>;
};

const InfoBank = ({title, value}) => {
  return (
    <View style={styles.infoBank}>
      <Text style={[styles.font12, {color: COLORS.TEXT_DARK_40}]}>{title}</Text>
      <SizeBox height={SIZES.SEPARATOR_2} />
      <Text style={[styles.font12, {color: COLORS.TEXT_DARK_10, ...FONTS.bold}]}>{value}</Text>
    </View>
  );
};

export const CardTopenerBank = ({
  item,
  onPressEditBank,
  onPressDeleteBank,
  onChangeDefaultBank,
}) => {
  const {
    bankAccountBranch,
    bankAccountHolderName,
    bankCode,
    bankAccountNumber,
    bankName,
    isDefault,
  } = item;

  return (
    <ImageBackground
      imageStyle={{borderRadius: SIZES.BORDER_RADIUS_8}}
      source={IMAGES.IMG_BACKGROUND_BANK_CARD}
      style={styles.container}>
      <RowCenter>
        <TouchableOpacity onPress={onChangeDefaultBank}>
          <Radio checked={isDefault} />
        </TouchableOpacity>
        <SizeBox width={SIZES.SEPARATOR_12} />
        <Text style={styles.bankCode}>{bankCode?.toUpperCase()}</Text>
        <SizeBox width={SIZES.SEPARATOR_8} />
        <View style={styles.height100}>
          <RowCenter>
            <TextButton
              text={translate('agent.bank.button.edit')}
              textColor={COLORS.PRIMARY_A100}
              onPress={onPressEditBank}
            />
            <TextButton
              text={translate('agent.bank.button.delete')}
              textColor={COLORS.PRIMARY_B100}
              onPress={onPressDeleteBank}
            />
          </RowCenter>
        </View>
      </RowCenter>
      <SizeBox height={SIZES.SEPARATOR_12} />
      <SizeBox
        height={SIZES.BORDER_WIDTH_1}
        width={SIZES.FULL_WIDTH}
        backgroundColor={COLORS.NEUTRAL_DIVIDER}
      />
      <SizeBox height={SIZES.SEPARATOR_12} />
      <Text style={styles.bankName}>{bankName}</Text>
      <Text style={styles.bankNumber}>{bankAccountNumber?.toUpperCase()}</Text>
      <InfoBank title={translate('agent.bank.nameBranch')} value={bankAccountBranch} />
      <SizeBox height={SIZES.SEPARATOR_8} />
      <InfoBank title={translate('agent.bank.holderBank')} value={bankAccountHolderName} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  height100: {height: '100%'},
  rowCenter: {flexDirection: 'row', alignItems: 'center'},
  bold16: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_16,
  },
  font12: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_12,
  },
  paddingHor16: {paddingHorizontal: SIZES.PADDING_12},
  radio: {
    width: 20,
    height: 20,
    borderRadius: SIZES.BORDER_RADIUS_16,
    borderWidth: 1,

    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subRadio: {
    width: 10,
    height: 10,
    borderRadius: SIZES.BORDER_RADIUS_16,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  container: {
    width: SIZES.SCREEN_WIDTH - 80,
    padding: SIZES.PADDING_16,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_8,
    marginRight: SIZES.MARGIN_16,
  },
  bankName: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_12,
    color: COLORS.TEXT_DARK_40,
  },
  bankCode: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.TEXT_DARK_10,
    flex: 1,
  },
  bankNumber: {
    ...FONTS.bold,
    marginTop: SIZES.MARGIN_2,
    marginBottom: SIZES.MARGIN_6,
    fontSize: SIZES.FONT_20,
  },
  infoBank: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
});
