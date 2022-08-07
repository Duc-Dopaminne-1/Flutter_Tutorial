import * as React from 'react';
import Svg, { SvgProps, G, Rect, Path, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const IconPlusSVG = (props: SvgProps) => (
  <Svg width={64} height={64} fill="none" {...props}>
    <G>
      <Rect x={12} y={12} width={40} height={40} rx={8} fill="#2C93DD" />
    </G>
    <Path
      d="M38.956 31.5H25.043c-.576 0-1.043.336-1.043.75s.467.75 1.044.75h13.912c.577 0 1.044-.336 1.044-.75s-.467-.75-1.044-.75Z"
      fill="#fff"
    />
    <Path
      d="M32.75 39.206V25.293c0-.576-.336-1.043-.75-1.043s-.75.467-.75 1.044v13.912c0 .577.336 1.044.75 1.044s.75-.467.75-1.044Z"
      fill="#fff"
    />
    <Defs></Defs>
  </Svg>
);

export default IconPlusSVG;
