import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const DropdownSVG = (props: SvgProps) => (
  <Svg width={14} height={8} fill="none" {...props}>
    <Path d="m1 1 6 6 6-6" stroke="#101920" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default DropdownSVG;
