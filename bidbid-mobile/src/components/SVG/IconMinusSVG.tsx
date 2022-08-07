import * as React from 'react';
import Svg, { SvgProps, G, Rect, Path, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const IconMinusSVG = (props: SvgProps) => (
  <Svg width={64} height={64} fill="none" {...props}>
    <G>
      <Rect x={12} y={12} width={40} height={40} rx={8} fill="#fff" />
      <Rect x={12.5} y={12.5} width={39} height={39} rx={7.5} stroke="#CAE4F7" />
    </G>
    <Path
      d="M38.956 31.5H25.043c-.576 0-1.043.336-1.043.75s.467.75 1.044.75h13.912c.577 0 1.044-.336 1.044-.75s-.467-.75-1.044-.75Z"
      fill="#2C93DD"
    />
    <Defs></Defs>
  </Svg>
);

export default IconMinusSVG;
