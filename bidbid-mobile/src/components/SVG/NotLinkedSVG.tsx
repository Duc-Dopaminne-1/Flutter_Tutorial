import * as React from 'react';
import Svg, { SvgProps, G, Rect, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const NotLinkedSVG = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <G>
      <Rect x={1} y={1} width={18} height={18} rx={9} fill="#fff" />
    </G>
    <Rect x={1} y={1} width={18} height={18} rx={9} stroke="#828282" strokeWidth={1.5} />
    <Defs></Defs>
  </Svg>
);

export default NotLinkedSVG;
