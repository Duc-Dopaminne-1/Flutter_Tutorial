import {StyleSheet} from 'react-native';

import {ITEM_TYPE} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {METRICS} from '../assets/theme/metric';
import NumberUtils from '../utils/NumberUtils';

const styles = StyleSheet.create({
  itemStyle: {
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    flexWrap: 'nowrap',
  },
});

export const projectPaddingStyle = (index, itemStyle = ITEM_TYPE.small) => {
  return index === 0 && itemStyle === ITEM_TYPE.small
    ? [styles.itemStyle, METRICS.horizontalMargin]
    : [styles.itemStyle, METRICS.marginEnd];
};

export const getPriceWithCurrency = amount => {
  if (amount) {
    return `${NumberUtils.formatNumberToCurrencyNumber(amount, 0)} ${translate(STRINGS.CURRENCY)}`;
  } else {
    return `0 ${translate(STRINGS.CURRENCY)}`;
  }
};
