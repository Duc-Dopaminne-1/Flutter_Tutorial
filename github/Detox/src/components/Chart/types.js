import {ViewStyle} from 'react-native';
import {AnimatePropTypeInterface} from 'victory-core';

export type PieChartDataProps = {
  x: Required<Number | String>,
  y: Required<Number>,
  label: String,
};

export type PieChartProps = {
  length: Required<Number>,
  innerRadius: Number,
  data: Required<Array<PieChartDataProps>>,
  colorScale: Array<String>,
  hideLable: Boolean,
  animate: Boolean | AnimatePropTypeInterface,
  padAngle: Number | Function,
};

export type ChartLegendProps = {
  title: String,
  titleDescription: String,
  description: String,
  themeColor: String,
  type: ChartType,
};

export type ChartType = 'ROW' | 'COLUMN' | 'DEFAULT';

export type PieChartWithLegendsProps = {
  chartLength: Number,
  chartLegends: Array<ChartLegendProps>,
  innerPaddingRadius: Number,
  data: Array<PieChartDataProps>,
  colorScale: Array<String>,
  padAngle: Number | Function,
  type: ChartType,
  customDescriptionView: JSX.Element,
  legendStyle: ViewStyle,
};
