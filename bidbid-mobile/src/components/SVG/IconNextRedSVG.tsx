import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const IconNextRedSVG = (props: SvgProps) => (
  <Svg width={8} height={14} fill="none" {...props}>
    <Path d="m1 13 6-6-6-6" stroke="#F9423A" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default IconNextRedSVG;
