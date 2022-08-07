import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const BorderLeftSVG = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.373 0 0 5.373 0 12V0h12Z" fill="#fff" />
  </Svg>
);

export default BorderLeftSVG;
