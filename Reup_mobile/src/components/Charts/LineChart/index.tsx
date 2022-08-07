import React from 'react';
import { View } from 'react-native';
import { LineChart as LineChartSvg } from 'react-native-chart-kit';
import { fonts, HEIGHT, WIDTH } from '@constants/vars';
import { styles } from '@components/Charts/LineChart/styles';
import { Note } from '@components/Charts/LineChart/component/Note';
import translate from '@src/localize';
import { ICON_CHART } from '@src/constants/icons';
import CustomSectionHeader from '@src/components/CustomSection';
import NavigationActionsService from '@src/navigation/navigation';
import { FILTER } from '@src/constants/screenKeys';
import { Theme } from '@components/Theme';

const chartConfig: any = {
  backgroundColor: Theme.report.maintenance.chart.background,
  backgroundGradientFrom: Theme.report.maintenance.chart.background,
  backgroundGradientTo: Theme.report.maintenance.chart.background,
  backgroundGradientToOpacity: 1,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => Theme.report.maintenance.chart.label,
  strokeWidth: 2,
  fillShadowGradientOpacity: 0,
  propsForLabels: {
    fontSize: 10,
    fontFamily: fonts.MontserratRegular,
  },
  propsForDots: {
    r: '0',
    strokeWidth: '0',
    stroke: Theme.report.maintenance.chart.dot,
  },
  linejoinType: 'round',
  propsForBackgroundLines: {
    strokeDasharray: '0',
    strokeOpacity: 0.4,
    stroke: Theme.report.maintenance.chart.stroke,
    strokeWidth: 1,
  },
};

const dataChart = {
  labels: [
    translate('month.jan'),
    translate('month.feb'),
    translate('month.mar'),
    translate('month.apr'),
    translate('month.may'),
    translate('month.jun'),
    translate('month.jul'),
    translate('month.aug'),
    translate('month.sep'),
    translate('month.oct'),
    translate('month.nov'),
    translate('month.dec'),
  ],
  datasets: [
    {
      data: [0, 50, 30, 10, 50, 30, 10, 50, 30, 10, 50, 30],
      color: (opacity = 1) => Theme.report.maintenance.chart.firstLine,
    },
    {
      data: [40, 10, 40, 40, 10, 20, 40, 10, 20, 40, 10, 60],
      color: (opacity = 1) => Theme.report.maintenance.chart.secondLine,
    },
  ],
};

export const LineChart = () => {

  const onApplyFilter = (filter: any) => {
    console.log('filter:', filter);
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 1,
      isYear: true,
      indexYear: 0,
      onFilter: onApplyFilter
    });
  };

  return (
    <View style={styles.container}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={'Revenue yearly'.toUpperCase()}
        icon={ICON_CHART}
        isShowFilter={true}
        onPressFilter={onPressFilter}
      />
      <View style={styles.line}></View>
      <LineChartSvg
        data={dataChart}
        width={WIDTH}
        height={(HEIGHT * 32) / 100}
        withInnerLines={true}
        withOuterLines={false}
        chartConfig={chartConfig}
        style={styles.chart}
      />
      <View style={styles.wrapNote}>
        <Note text={'2017'} backgroundColor={Theme.report.maintenance.chart.firstYear} />
        <Note text={'2018'} backgroundColor={Theme.report.maintenance.chart.lastYear} />
      </View>
    </View>
  );
};
