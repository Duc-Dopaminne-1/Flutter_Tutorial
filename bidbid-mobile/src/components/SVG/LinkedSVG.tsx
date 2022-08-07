import * as React from 'react';
import Svg, { SvgProps, G, Rect, Path, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const LinkedSVG = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <G>
      <Rect x={1} y={1} width={18} height={18} rx={9} fill="#fff" />
    </G>
    <Rect x={1} y={1} width={18} height={18} rx={9} stroke="#219653" strokeWidth={1.5} />
    <Path d="m5 10 3.871 4L15 7" stroke="#219653" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Defs></Defs>
  </Svg>
);

export default LinkedSVG;
