import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const ReadAllSVG = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path d="M14 7 7 17l-4-4M21 7h-4M21 12h-7M21 17H11" stroke="#575E62" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default ReadAllSVG;
