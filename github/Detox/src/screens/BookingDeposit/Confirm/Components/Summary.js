import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS, tiny} from '../../../../assets/theme/metric';
import PropertyType from '../../../ManagePost/PropertyType';

const styles = StyleSheet.create({
  propertyId: {
    flex: 3,
    borderRadius: 4,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    paddingVertical: tiny,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  floor: {
    flex: 2,
    marginLeft: tiny,
    borderRadius: 4,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  block: {
    flex: 2,
    marginLeft: tiny,
    borderRadius: 4,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  summaryName: {...FONTS.regular, fontSize: 13, padding: tiny, color: COLORS.BRAND_GREY},
  summaryValue: {...FONTS.semiBold, fontSize: 15, padding: tiny},
});

const Summary = ({propertyPost}) => {
  const {propertyCode, floor, blockName, propertyTypeName} = propertyPost ?? {};
  return (
    <>
      <View style={[HELPERS.row, METRICS.smallPaddingTop]}>
        {propertyTypeName && (
          <View style={styles.propertyId}>
            <Text style={styles.summaryName}>{translate(STRINGS.PRODUCT_CODE)}</Text>
            <Text style={styles.summaryValue}>{propertyCode}</Text>
          </View>
        )}
        {propertyTypeName === PropertyType.apartment && (
          <View style={styles.floor}>
            <Text style={styles.summaryName}>{translate(STRINGS.FLOOR)}</Text>
            <Text style={styles.summaryValue}>{floor}</Text>
          </View>
        )}
        {propertyTypeName === PropertyType.apartment && (
          <View style={styles.block}>
            <Text style={styles.summaryName}>{translate('common.tower')}</Text>
            <Text style={styles.summaryValue}>{blockName}</Text>
          </View>
        )}
        {propertyTypeName !== PropertyType.apartment && (
          <View style={styles.block}>
            <Text style={styles.summaryName}>{translate(STRINGS.SUB_AREA)}</Text>
            <Text style={styles.summaryValue}>{blockName}</Text>
          </View>
        )}
        {/* <View style={styles.priority}>
          <Text style={styles.summaryName}>{translate(STRINGS.PRIORITY)}</Text>
          <Text style={styles.summaryValue}>2</Text>
        </View> */}
      </View>
    </>
  );
};

export default Summary;
