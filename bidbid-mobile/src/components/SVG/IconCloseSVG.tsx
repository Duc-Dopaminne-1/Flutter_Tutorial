import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const IconCloseSVG = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path d="M18 6 6 18M6 6l12 12" stroke="#101920" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default IconCloseSVG;
