import React from 'react';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import { colors, WIDTH } from '@constants/vars';
import { Theme } from '@components/Theme';

const data = [
  { x: 'Closed', y: 6 },
  { x: 'On Hold', y: 5 },
  { x: 'Open', y: 4 },
];

const styleBar = {
  data: {
    ...{
      fill: (data: any) => {
        let color = colors.RED_COLOR;

        if (data.index === 0) {
          color = colors.BLUE;
        }

        if (data.index === 1) {
          color = colors.WARNING;
        }
        if (data.index === 2) {
          color = colors.RED_COLOR;
        }
        return color;
      },
      opacity: 0.9,
    },
  },
};

const styleChartY = {
  axis: {
    stroke: Theme.report.maintenance.chart.lineChart
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

const BarChartHorizontal = () => {
  return (
    <VictoryChart
      animate={{
        duration: 1000,
        onLoad: { duration: 350 },
      }}
      theme={VictoryTheme.grayscale}
      domainPadding={{ x: 10 }}
      height={220}
      width={WIDTH}
    >
      <VictoryBar
        horizontal
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
        tickFormat={t => t}
        style={styleChartX}
      />
    </VictoryChart>
  );
};

export default React.memo(BarChartHorizontal);
