import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';

const IconGrayShowDistanceSVG = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Rect width={28} height={28} rx={14} fill="#CFD1D2" />
    <Path d="M7.25 8.623v3.75H11" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 18.624v-3.75h-3.75" fill="#fff" />
    <Path d="M21 18.624v-3.75h-3.75" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M19.431 11.748a5.625 5.625 0 0 0-9.281-2.1l-2.9 2.726m13.75 2.5-2.9 2.725a5.624 5.624 0 0 1-9.281-2.1"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IconGrayShowDistanceSVG;
