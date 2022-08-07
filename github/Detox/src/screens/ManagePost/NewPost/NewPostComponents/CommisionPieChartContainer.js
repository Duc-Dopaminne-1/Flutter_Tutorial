import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {APP_CURRENCY, CONSTANTS} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import PieChartWithLegends from '../../../../components/Chart/PieChartWithLegends';
import TextView from '../../../../components/TextView';
import NumberUtils from '../../../../utils/NumberUtils';
import PropertyPostUtils, {
  COMMISSION_CHART_INNER_PADDING_RADIUS,
  COMMISSION_CHART_LENGTH,
  COMMISSION_CHART_PORTION_PADDING,
} from '../../PropertyPostUtils';
import {CommissionPieChartContainerProps} from '../../types';

const TotalDescriptionView = ({totalAmount, onPressConfigurePercentage}) => {
  return (
    <>
      <View style={METRICS.smallVerticalPadding}>
        <TextView
          customStyle={HELPERS.fill}
          containerStyle={HELPERS.center}
          customLeftComponent={
            <View>
              <Text style={commonStyles.blackTextBold16}>
                {translate('newPost.step1.sectionTitle.commissionDetail')}
              </Text>
              <Text style={commonStyles.subColorText16}>
                {NumberUtils.formatNumberToCurrencyNumber(totalAmount, 0)} {APP_CURRENCY}
              </Text>
            </View>
          }
          customRightComponent={
            <View style={[HELPERS.fill, HELPERS.crossEnd]}>
              <TouchableOpacity
                style={styles.configureButton}
                hitSlop={CONSTANTS.HIT_SLOP}
                onPress={onPressConfigurePercentage}>
                <Text style={[commonStyles.blackTextBold14, {color: COLORS.PRIMARY_A100}]}>
                  {translate('newPost.step1.configurePercentage')}
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </>
  );
};

const Caution = ({onPressPolicy}) => {
  return (
    <View>
      <Text style={commonStyles.blackTextBold14}>{translate('common.caution')}:</Text>
      <View style={commonStyles.separatorRow8} />
      <Text style={commonStyles.blackText14}>
        {translate('newPost.commissionCautionDescription')}
        <Text
          hitSlop={CONSTANTS.HIT_SLOP}
          style={{color: COLORS.PRIMARY_A100}}
          onPress={onPressPolicy}>
          {translate('newPost.commissionCautionDescription1')}
        </Text>
        <Text>{translate('newPost.commissionCautionDescription2')}</Text>
        <Text style={FONTS.bold}>{translate('newPost.commissionCautionDescription3')}</Text>
        <Text>{translate('newPost.commissionCautionDescription4')}</Text>
      </Text>
    </View>
  );
};

const CommissionPieChartContainer = ({
  totalAmount,
  buyerPercentage,
  sellerPercentage,
  onPressConfigurePercentage,
  onPressPolicy,
  hideCautionText = false,
}: CommissionPieChartContainerProps) => {
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
    <View>
      <TotalDescriptionView
        totalAmount={totalAmount}
        onPressConfigurePercentage={onPressConfigurePercentage}
      />
      <View style={commonStyles.separatorRow16} />
      <PieChartWithLegends
        data={chartData}
        chartLength={COMMISSION_CHART_LENGTH}
        innerPaddingRadius={COMMISSION_CHART_INNER_PADDING_RADIUS}
        chartLegends={chartLegends}
        colorScale={colorScales}
        padAngle={COMMISSION_CHART_PORTION_PADDING}
      />

      {hideCautionText || (
        <>
          <View style={commonStyles.separatorRow16} />
          <Caution onPressPolicy={onPressPolicy} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  configureButton: {
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderColor: COLORS.PRIMARY_A100,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: SIZES.BORDER_RADIUS_8,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
});

export default CommissionPieChartContainer;
