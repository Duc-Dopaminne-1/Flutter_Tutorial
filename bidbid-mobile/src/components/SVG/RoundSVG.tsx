import * as React from 'react';
import Svg, { SvgProps, Circle } from 'react-native-svg';

const RoundSVG = (props: SvgProps) => (
  <Svg width={10} height={10} fill="none" {...props}>
    <Circle cx={5} cy={5} r={5} fill="#FA6861" />
  </Svg>
);

export default RoundSVG;
