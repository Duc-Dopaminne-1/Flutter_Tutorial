import * as React from 'react';
import Svg, { SvgProps, G, Rect, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const RadioUnCheckSVG = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <G>
      <Rect width={16} height={16} rx={8} fill="#fff" />
    </G>
    <Rect x={0.5} y={0.5} width={15} height={15} rx={7.5} stroke="#CFD1D2" />
    <Defs></Defs>
  </Svg>
);

export default RadioUnCheckSVG;
