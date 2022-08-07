import * as React from 'react';
import Svg, { SvgProps, Rect } from 'react-native-svg';

const IconBoxUnCheckSVG = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <Rect x={0.5} y={0.5} width={15} height={15} rx={1.5} fill="#fff" stroke="#CFD1D2" />
  </Svg>
);

export default IconBoxUnCheckSVG;
