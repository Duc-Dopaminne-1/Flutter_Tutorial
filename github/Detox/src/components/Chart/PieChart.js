import React from 'react';
import {VictoryPie} from 'victory-native';

import {PieChartDataProps} from './types';

const PieChart = ({
  length,
  innerRadius,
  data,
  colorScale,
  hideLable,
  animate = {duration: 1500},
  padAngle,
}: PieChartDataProps) => {
  return (
    <VictoryPie
      innerRadius={innerRadius}
      radius={length / 2}
      labelRadius={hideLable ? length + 100 : 0} // set > chart length to hide the label
      data={data}
      animate={animate}
      colorScale={colorScale}
      width={length}
      padAngle={padAngle}
      height={length}
    />
  );
};

export default PieChart;
