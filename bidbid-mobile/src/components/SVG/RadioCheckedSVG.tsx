import * as React from 'react';
import Svg, { SvgProps, G, Rect, Path, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const RadioCheckedSVG = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <G>
      <Rect width={16} height={16} rx={8} fill="#fff" />
    </G>
    <Rect x={0.5} y={0.5} width={15} height={15} rx={7.5} stroke="#2C93DD" />
    <Path fillRule="evenodd" clipRule="evenodd" d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="#2C93DD" />
    <Defs></Defs>
  </Svg>
);

export default RadioCheckedSVG;
