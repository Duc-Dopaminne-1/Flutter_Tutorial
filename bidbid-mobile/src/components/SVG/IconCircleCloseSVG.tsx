import * as React from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';

const IconCircleCloseSVG = (props: SvgProps) => (
  <Svg width={40} height={40} fill="none" {...props}>
    <Circle cx={20} cy={20} r={20} fill="#fff" />
    <Path d="M26 14 14 26M14 14l12 12" stroke="#F9423A" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default IconCircleCloseSVG;
