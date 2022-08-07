import React, { useState } from 'react';
import { View } from 'react-native';
import styles from '@screens/tenant/VacancyReportsTenant/Chart/styles';
import { LineChart } from 'react-native-chart-kit';
import { fonts, WIDTH } from '@constants/vars';
import translate from '@src/localize';
import Dot from '@screens/tenant/VacancyReportsTenant/Chart/Dot';
import { Theme } from '@components/Theme';

const data = {
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
      data: [15, 20, 24, 30, 20, 30, 25, 40, 30, 20, 27, 30],
      color: (opacity = 1) => Theme.report.vacancy.chart.lineChart,
      strokeWidth: 1
    }
  ],
};

const chartConfig: any = {
  fillShadowGradientOpacity: 0.8,
  backgroundColor: Theme.report.vacancy.chart.backgroundColor,
  backgroundGradientFrom: Theme.report.vacancy.chart.backgroundColor,
  backgroundGradientTo: Theme.report.vacancy.chart.backgroundColor,
  useShadowColorFromDataset: true,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  paddingRight: 15,
  propsForLabels: {
    fontSize: 10,
    fontFamily: fonts.MontserratRegular,
    fill: Theme.report.vacancy.chart.label,
  },
  propsForDots: {
    r: '0',
    strokeWidth: '0',
    dot: Theme.report.vacancy.chart.dot,
  },
  linejoinType: 'round',
  propsForBackgroundLines: {
    strokeDasharray: '0',
    strokeOpacity: 0.2,
    stroke: Theme.report.vacancy.chart.line,
    strokeWidth: 1,
  },
};

const LineChartBezier = () => {
  const [indexDot, setIndexDot] = useState(-1);

  function onPressDot(data) {
    if (data.index !== indexDot) {
      setIndexDot(data.index);
    }
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={WIDTH}
        height={180}
        onDataPointClick={onPressDot}
        renderDotContent={(data: any) => <Dot data={data} indexDot={indexDot} onPressDot={onPressDot} />}
        withInnerLines={true}
        withOuterLines={false}
        yAxisSuffix={'%'}
        chartConfig={chartConfig}
        style={styles.chart}
      />
    </View>
  );
};

export default React.memo(LineChartBezier);
