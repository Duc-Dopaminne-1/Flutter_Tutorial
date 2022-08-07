import React from 'react';
import {StyleSheet, View} from 'react-native';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import InfoCell from './components/InfoCell';

const CommissionRow = ({hide, price, buildingArea, pricePerSquare}) => {
  if (hide) {
    return null;
  }

  return (
    <View style={METRICS.smallNormalMarginTop}>
      <View style={styles.separatorLine} />
      <View style={commonStyles.separatorRow12} />
      <View style={HELPERS.row}>
        <InfoCell
          label={translate(STRINGS.PRICE)}
          value={price || '--'}
          customStyleValue={{...commonStyles.blackTextBold20, color: COLORS.PRIMARY_A100}}
          style={styles.cellFlex2}
        />
        <InfoCell
          label={translate(STRINGS.ACREAGE)}
          value={`${buildingArea || '--'} m²`}
          customStyleValue={{...commonStyles.blackTextBold20, color: COLORS.PRIMARY_B100}}
          style={styles.cellFlex2}
        />
        <InfoCell
          label={translate('common.unitPrice')}
          value={`${pricePerSquare || '--'} ${translate(STRINGS.UNIT_MILLION_M2)}`}
          customStyleValue={{...commonStyles.blackText20, color: COLORS.BLACK_31}}
          style={styles.cellFlex3}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cellFlex2: {
    flex: 2,
  },
  cellFlex3: {
    flex: 3,
  },
  separatorLine: {
    borderTopWidth: 1,
    borderTopColor: COLORS.SEPARATOR_LINE,
  },
});

export default CommissionRow;
