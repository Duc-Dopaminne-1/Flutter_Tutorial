import isEmpty from 'lodash/isEmpty';
import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal, small} from '../../../assets/theme/metric';

const ListItem = ({item, onPress}) => {
  if (isEmpty(item)) return null;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.row]}>
        <View style={[styles.statusBox]}>
          <Text style={styles.status}>
            {item?.forSale
              ? translate('c2CGeneralRequest.buy')
              : translate('c2CGeneralRequest.rent')}
          </Text>
        </View>
        <Text style={styles.status}>{item?.createdDatetime}</Text>
      </View>
      <Text style={styles.title}>{item?.title}</Text>
      <View style={[styles.row, METRICS.smallMarginTop]}>
        <Text style={styles.label}>{translate(STRINGS.REQUEST_CODE)}</Text>
        <Text style={styles.value}>{item?.c2CDemandCode}</Text>
      </View>
      <View style={[styles.row, METRICS.smallMarginTop]}>
        <Text style={styles.label}>{translate(STRINGS.PROPERTY_TYPE)}</Text>
        <Text style={styles.value}>{item?.propertyTypeName}</Text>
      </View>
      <View style={[styles.row, METRICS.smallMarginTop]}>
        <Text style={styles.label}>{translate(STRINGS.AREA)}</Text>
        <Text style={styles.value}>{item?.areas}</Text>
      </View>
      <View style={[styles.row, METRICS.smallMarginTop]}>
        <Text style={styles.label}>{translate(STRINGS.PRICE_RANGE_OF_INTEREST)}</Text>
        <Text style={styles.value}>{item?.priceRange}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: SIZES.BORDER_RADIUS_8,
    padding: normal,
    marginVertical: small,
    borderWidth: 1,
    borderColor: COLORS.NEUTRAL_BORDER,
  },
  statusBox: {
    backgroundColor: COLORS.GRAY_ED,
    borderRadius: SIZES.BORDER_RADIUS_20,
    paddingVertical: SIZES.MARGIN_2,
    paddingHorizontal: normal,
    alignSelf: 'flex-start',
  },
  status: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_12,
    color: COLORS.BLACK_31,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_16,
    marginTop: small,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.BRAND_GREY,
    marginRight: small,
  },
  value: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_BLACK,
    textAlign: 'right',
    flex: 1,
  },
});

export default memo(ListItem);
