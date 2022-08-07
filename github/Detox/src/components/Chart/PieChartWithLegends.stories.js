import {storiesOf} from '@storybook/react-native';
import React from 'react';

import PieChartWithLegends from './PieChartWithLegends';

const CHART_LENGTH = 156;
const CHART_PORTION_PADDING = 1;
const CHART_INNER_PADDING_RADIUS = 46;

storiesOf('Chart', module) //format
  .add('PieChartWithLegends/Default', () => <PieChartWithLegends {...pieChartWithLegendsData} />)
  .add('PieChartWithLegends/Row', () => (
    <PieChartWithLegends {...pieChartWithLegendsData} type={'ROW'} />
  ));

const pieChartWithLegendsData = {
  data: [
    {x: 1, y: 20},
    {x: 2, y: 60},
    {x: 3, y: 20},
  ],
  colorScale: ['#CCD1D9', '#FFC13D', '#8D33FF'],
  padAngle: CHART_PORTION_PADDING,
  chartLength: CHART_LENGTH,
  innerPaddingRadius: CHART_INNER_PADDING_RADIUS,
  chartLegends: [
    {
      title: 'TopenLand',
      titleDescription: `200.000.000 VND`,
      description: `20 %`,
      themeColor: '#CCD1D9',
    },
    {
      title: 'Người mua',
      titleDescription: `600.000.000 VND`,
      description: `60 %`,
      themeColor: '#FFC13D',
    },
    {
      title: 'Người bán',
      titleDescription: `200.000.000 VND`,
      description: `20 %`,
      themeColor: '#8D33FF',
    },
  ],
};
