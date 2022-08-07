import * as React from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';

const CloseSearchSVG = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <Circle cx={10} cy={10} r={10} fill="#F9423A" />
    <Path d="m13.5 6.5-7 7M6.5 6.5l7 7" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default CloseSearchSVG;
