import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {PAYMENT_UNITS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS, small, tiny} from '../assets/theme/metric';
import {getPriceWithCurrency} from '../utils/RenderUtil';

const styles = StyleSheet.create({
  depositCode: {
    flex: 3,
    borderRadius: tiny,
    ...HELPERS.center,
    backgroundColor: COLORS.GREEN_80,
    paddingVertical: 11,
  },
  name: {
    ...HELPERS.fillCenter,
    borderRadius: tiny,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    paddingVertical: 11,
  },
  priority: {
    ...HELPERS.fillCenter,
    marginLeft: small,
    borderRadius: tiny,
    backgroundColor: COLORS.PINK_E6,
  },
});

const TransactionInfo = ({
  transactionIndex,
  projectName,
  amount,
  transactionCode,
  code,
  paymentUnit,
}) => {
  return (
    <>
      <View style={[HELPERS.rowCenter, METRICS.tinyVerticalPadding]}>
        <View style={styles.name}>
          <Text style={{...FONTS.regular, color: COLORS.BRAND_GREY}}>Tên dự án</Text>
          <Text style={{...FONTS.bold, marginTop: tiny, ...FONTS.bold}}>{projectName}</Text>
        </View>
      </View>
      <View style={[HELPERS.rowCenter, METRICS.tinyVerticalPadding]}>
        <View style={styles.name}>
          <Text style={{...FONTS.regular, color: COLORS.BRAND_GREY}}>Mã sản phẩm</Text>
          <Text style={{...FONTS.bold, marginTop: tiny}}>{code}</Text>
        </View>
        <View style={[styles.name, {marginLeft: small}]}>
          <Text style={{...FONTS.regular, color: COLORS.BRAND_GREY}}>Đã thanh toán</Text>
          <Text style={{...FONTS.bold, marginTop: tiny, color: COLORS.STATE_ERROR}}>
            {getPriceWithCurrency(amount)}
          </Text>
        </View>
      </View>
      <View style={[HELPERS.row, METRICS.tinyVerticalPadding]}>
        <View style={styles.depositCode}>
          <Text style={{...FONTS.regular, color: COLORS.PRIMARY_A100}}>Mã đặt chỗ</Text>
          <Text style={{...FONTS.bold, marginTop: tiny, color: COLORS.PRIMARY_A100}}>
            {transactionCode}
          </Text>
        </View>
        <View style={styles.priority}>
          <Text style={{...FONTS.regular, color: COLORS.STATE_ERROR}}>Ưu tiên</Text>
          <Text style={{...FONTS.bold, marginTop: tiny, color: COLORS.STATE_ERROR}}>
            {transactionIndex ?? '--'}
          </Text>
        </View>
      </View>
      <View style={[HELPERS.rowCenter, METRICS.tinyVerticalPadding]}>
        <View style={styles.name}>
          <Text style={{...FONTS.regular, color: COLORS.BRAND_GREY}}>
            {translate('common.paymentMethod')}
          </Text>
          <Text style={{...FONTS.bold, marginTop: tiny, ...FONTS.bold}}>
            {PAYMENT_UNITS[paymentUnit]?.name}
          </Text>
        </View>
      </View>
    </>
  );
};

TransactionInfo.propTypes = {
  projectName: PropTypes.string,
  amount: PropTypes.number,
  code: PropTypes.string,
};

TransactionInfo.defaultProps = {
  projectName: '',
  amount: 0,
  code: '',
};

export default TransactionInfo;
