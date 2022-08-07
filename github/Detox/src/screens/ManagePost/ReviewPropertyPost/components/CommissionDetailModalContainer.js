import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {APP_CURRENCY} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomButton from '../../../../components/Button/CustomButton';
import PieChartWithLegends from '../../../../components/Chart/PieChartWithLegends';
import {SizeBox} from '../../../../components/SizeBox';
import NumberUtils from '../../../../utils/NumberUtils';
import PropertyPostUtils, {
  COMMISSION_CHART_INNER_PADDING_RADIUS,
  COMMISSION_CHART_LENGTH,
  COMMISSION_CHART_PORTION_PADDING,
} from '../../PropertyPostUtils';

const CommissionDetailModalContainer = ({
  totalAmount,
  buyerPercentage,
  sellerPercentage,
  onPressClose,
}) => {
  const chartLegends = PropertyPostUtils.mapCommissionChartLegends(
    totalAmount,
    buyerPercentage,
    sellerPercentage,
  );

  const chartData = PropertyPostUtils.mapCommissionChartData({
    buyerPercentage,
    sellerPercentage,
  });

  const colorScales = PropertyPostUtils.mapCommissionChartColorScales({
    buyerPercentage,
    sellerPercentage,
  });

  return (
    <View style={styles.container}>
      <View style={METRICS.padding}>
        <Text style={commonStyles.blackTextBold24}>
          {translate('propertyPost.commissionDetail')}
        </Text>
      </View>
      <View style={commonStyles.separatorRow16} />
      <PieChartWithLegends
        data={chartData}
        chartLength={COMMISSION_CHART_LENGTH}
        innerPaddingRadius={COMMISSION_CHART_INNER_PADDING_RADIUS}
        chartLegends={chartLegends}
        colorScale={colorScales}
        padAngle={COMMISSION_CHART_PORTION_PADDING}
        customDescriptionView={
          <View style={styles.totalDescriptionContainer}>
            <View>
              <Text style={styles.descriptionTitle}>{translate('newPost.total')}</Text>
              <Text style={styles.descriptionText}>
                {NumberUtils.formatNumberToCurrencyNumber(totalAmount, 0)} {APP_CURRENCY}
              </Text>
            </View>

            <View style={styles.descriptionRightContainer}>
              <Text style={styles.descriptionTitle}>100%</Text>
            </View>
          </View>
        }
        legendStyle={styles.chartLegendContainer}
      />
      <SizeBox height={SIZES.SEPARATOR_16} />
      <View style={commonStyles.separatorLine} />
      <CustomButton
        style={styles.closeButton}
        title={translate(STRINGS.CLOSE)}
        titleStyle={FONTS.bold}
        onPress={onPressClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  totalDescriptionContainer: {
    ...HELPERS.fillRowSpaceBetween,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    marginVertical: SIZES.MARGIN_16,
    paddingVertical: SIZES.PADDING_12,
    paddingHorizontal: SIZES.PADDING_16,
  },
  closeButton: {
    backgroundColor: COLORS.PRIMARY_A100,
    paddingVertical: 13,
    margin: 16,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  descriptionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_16,
    color: COLORS.PRIMARY_B100,
  },
  descriptionText: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.PRIMARY_B100,
  },
  descriptionRightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  chartLegendContainer: {
    marginHorizontal: SIZES.MARGIN_16,
  },
});

export default CommissionDetailModalContainer;
