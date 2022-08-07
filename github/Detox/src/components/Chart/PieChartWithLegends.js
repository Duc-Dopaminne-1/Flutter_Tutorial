import React, {Fragment, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../assets/theme/colors';
import {HELPERS} from '../../assets/theme/helpers';
import {commonStyles} from '../../assets/theme/styles';
import PieChart from './PieChart';
import {ChartLegendProps, ChartType, PieChartWithLegendsProps} from './types';

const renderChartLegends = ({
  chartLegends,
  type,
}: {
  type: ChartType,
  chartLegends: Array<ChartLegendProps>,
}) => {
  if (!chartLegends) {
    return null;
  }

  return chartLegends.map((e, index) => (
    <Fragment key={e.title}>
      {index > 0 && index < chartLegends.length && <View style={commonStyles.separatorRow12} />}
      <ChartLegendDescription
        type={type}
        title={e.title}
        titleDescription={e.titleDescription}
        description={e.description}
        themeColor={e.themeColor}
      />
    </Fragment>
  ));
};

const ChartLegendDescription = ({
  title = '',
  titleDescription = '',
  description = '',
  themeColor = COLORS.GRAY_A3,
  type = 'DEFAULT',
}: ChartLegendProps) => {
  const titleDescriptionStyle = styles.legendTitleDescription(type);
  return (
    <View>
      <View style={[HELPERS.row, HELPERS.crossCenter]}>
        <View
          style={{
            ...styles.bulletin,
            backgroundColor: themeColor,
          }}
        />
        <View style={commonStyles.separatorColumn8} />
        <Text numberOfLines={1} style={commonStyles.blackTextBold16}>
          {title}
        </Text>
      </View>
      <View style={commonStyles.separatorRow4} />

      <View style={HELPERS.rowSpaceBetween}>
        <Text style={titleDescriptionStyle}>{titleDescription}</Text>
        <Text style={commonStyles.blackTextBold16}>{description}</Text>
      </View>
    </View>
  );
};

const PieChartWithLegends = ({
  chartLength,
  chartLegends,
  customDescriptionView,
  innerPaddingRadius,
  data,
  colorScale,
  padAngle,
  type = 'DEFAULT',
  legendStyle,
}: PieChartWithLegendsProps) => {
  const ChartLegendView = useMemo(
    () => renderChartLegends({chartLegends, type}),
    [chartLegends, type],
  );
  const descriptionColView = useMemo(() => {
    if (type === 'DEFAULT' || type === 'COLUMN') {
      return customDescriptionView;
    }

    return null;
  }, [type, customDescriptionView]);

  const containerStyle = styles.container(type);
  const separatorStyle = styles.separator(type);
  const chartLegendContainerStyle = styles.legendContainer(type);
  const chartContainer = styles.chartContainer(type);

  return (
    <View style={containerStyle}>
      <View style={chartContainer}>
        <PieChart
          hideLable
          length={chartLength}
          innerRadius={innerPaddingRadius}
          data={data}
          colorScale={colorScale}
          padAngle={padAngle}
        />
      </View>
      {descriptionColView || <View style={separatorStyle} />}
      <View style={[chartLegendContainerStyle, legendStyle]}>{ChartLegendView}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: (type: ChartType) => {
    switch (type) {
      case 'ROW':
        return {
          ...HELPERS.row,
        };
      case 'COLUMN':
      default:
        return {
          ...HELPERS.fill,
        };
    }
  },
  separator: (type: ChartType) => {
    switch (type) {
      case 'ROW':
        return {
          ...commonStyles.separatorColumn32,
        };
      case 'COLUMN':
      default:
        return {
          ...commonStyles.separatorRow12,
        };
    }
  },
  legendContainer: (type: ChartType) => {
    switch (type) {
      case 'ROW':
        return [HELPERS.fill, HELPERS.mainCenter];
      case 'COLUMN':
      default:
        return [HELPERS.mainCenter];
    }
  },
  chartContainer: (type: ChartType) => {
    switch (type) {
      case 'ROW':
        return {};
      case 'COLUMN':
      default:
        return [HELPERS.center];
    }
  },
  legendTitleDescription: (type: ChartType) => {
    switch (type) {
      case 'ROW':
        return {};
      case 'COLUMN':
      default:
        return {
          ...commonStyles.blackText16,
          marginLeft: 18,
        };
    }
  },
  bulletin: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default PieChartWithLegends;
