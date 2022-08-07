import * as React from 'react';
import Svg, { SvgProps, Circle } from 'react-native-svg';

const DotSVG = (props: SvgProps) => (
  <Svg width={8} height={8} fill="none" {...props}>
    <Circle cx={4} cy={4} r={4} fill="#2C93DD" />
  </Svg>
);

export default DotSVG;
