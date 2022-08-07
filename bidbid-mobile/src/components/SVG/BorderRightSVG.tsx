import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const BorderRightSVG = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path fillRule="evenodd" clipRule="evenodd" d="M0 0c6.627 0 12 5.373 12 12V0H0Z" fill="#fff" />
  </Svg>
);

export default BorderRightSVG;
