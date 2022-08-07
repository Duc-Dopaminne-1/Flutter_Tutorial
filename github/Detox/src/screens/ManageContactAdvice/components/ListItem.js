import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';

const defaultData = {
  status: 'Yêu cầu mới',
  type: 'Công chứng theo yêu cầu',
  code: 'YC-196',
  product: 'In ipsum excepteur cupidatat magna consectetur eiusmod in ullamco amet.',
  date: '02/02/2021 09:30',
};

const ListItem = ({data = defaultData, statusColor, onPress, onPressProduct = alert}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View
        style={[
          styles.statusBox,
          {
            backgroundColor: statusColor,
          },
        ]}>
        <Text style={styles.status}>{data?.status}</Text>
      </View>
      <Text style={styles.type}>{data?.type}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>{translate('contactAdvice.listItem.id')}</Text>
        <Text style={styles.value}>{data?.code}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{translate('contactAdvice.listItem.product')}</Text>
        <TouchableOpacity style={styles.value} onPress={() => onPressProduct(data?.product)}>
          <Text style={[styles.value, styles.productValue]} numberOfLines={1}>
            {data?.product}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>{translate('contactAdvice.listItem.date')}</Text>
        <Text style={styles.value}>{data?.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ListItem);

const styles = StyleSheet.create({
  container: {
    ...commonStyles.shadowApp,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: SIZES.BORDER_RADIUS_8,
    padding: normal,
    marginVertical: small,
  },
  statusBox: {
    backgroundColor: COLORS.GREEN,
    borderRadius: 30,
    paddingVertical: 2,
    paddingHorizontal: normal,
    alignSelf: 'flex-start',
  },
  status: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.NEUTRAL_WHITE,
  },
  type: {
    ...FONTS.bold,
    fontSize: 16,
    marginTop: small,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: small,
  },
  label: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BRAND_GREY,
    marginRight: small,
  },
  value: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
    textAlign: 'right',
    flex: 1,
  },
  productValue: {
    color: COLORS.PRIMARY_A100,
    marginLeft: normal,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.SEPARATOR_LINE,
    marginTop: small,
  },
});
