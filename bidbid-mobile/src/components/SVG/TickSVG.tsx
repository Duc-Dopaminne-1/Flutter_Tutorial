import * as React from 'react';
import Svg, { SvgProps, Circle, Mask, Path, G } from 'react-native-svg';

const TickSVG = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <Circle cx={10} cy={10} r={10} fill="#2C93DD" />
    <Mask id="a" x={3} y={3} width={14} height={14}>
      <Path fill="#C4C4C4" d="M3 3h14v14H3z" />
    </Mask>
    <G mask="url(#a)">
      <Path
        d="M15.662 6.088a.583.583 0 0 0-.825 0L7.85 13.076 5.162 10.39a.583.583 0 1 0-.825.825l3.1 3.099a.584.584 0 0 0 .824 0l7.401-7.401a.583.583 0 0 0 0-.825Z"
        fill="#fff"
      />
    </G>
  </Svg>
);

export default TickSVG;
