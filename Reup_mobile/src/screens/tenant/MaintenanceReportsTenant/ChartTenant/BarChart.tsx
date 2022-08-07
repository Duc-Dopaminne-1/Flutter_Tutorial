import React from 'react';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import { HEIGHT, WIDTH } from '@constants/vars';
import { View } from 'react-native';
import styles from './styles';
import { Theme } from '@components/Theme';

const data = [
  { x: '<2', y: 6 },
  { x: '2-3', y: 7 },
  { x: '4-5', y: 4 },
  { x: '6-7', y: 10 },
  { x: '8-9', y: 7 },
  { x: '10-11', y: 2 },
  { x: '12-13', y: 6 },
  { x: '18-19', y: 10 },
  { x: '20-21', y: 7 },
  { x: '28-29', y: 2 },
  { x: '34-35', y: 6 },
];

const styleChartY = {
  grid: {
    stroke: ({ tick }) => Theme.report.maintenance.chart.grid,
    strokeWidth: 0.5,
  },
  axis: {
    stroke: Theme.report.maintenance.chart.lineChart,
  },
  ticks: {
    stroke: 'transparent',
  },
  tickLabels: {
    color: Theme.report.maintenance.chart.tickLabels,
    fill: Theme.report.maintenance.chart.fill,
    fontSize: 10,
  },
};

const styleBar = {
  data: {
    fill: Theme.report.maintenance.chart.barFill,
    opacity: 0.9,
  },
};

const styleChartX = {
  axis: {
    stroke: Theme.report.maintenance.chart.lineChart,
  },
  ticks: {
    stroke: 'transparent',
  },
  tickLabels: {
    color: Theme.report.maintenance.chart.tickLabels,
    fill: Theme.report.maintenance.chart.fill,
    fontSize: 10,
  },
};

const BarChart = () => {
  return (
    <View style={styles.container}>
      <VictoryChart
        theme={VictoryTheme.grayscale}
        domainPadding={{ x: 10 }}
        height={(HEIGHT * 30) / 100}
        width={WIDTH + 40}
      >
        <VictoryBar
          barWidth={20}
          alignment="middle"
          style={styleBar}
          data={data}
        />

        <VictoryAxis
          dependentAxis
          theme={VictoryTheme.material}
          tickFormat={t => t}
          style={styleChartY}
          standalone={false}
        />

        <VictoryAxis
          standalone={false}
          tickFormat={t => t + '\n Days'}
          style={styleChartX}
        />
      </VictoryChart>
    </View>
  );
};

export default React.memo(BarChart);
