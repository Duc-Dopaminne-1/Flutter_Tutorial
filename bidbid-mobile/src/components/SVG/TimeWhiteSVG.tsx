import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const TimeWhiteSVG = (props: SvgProps) => (
  <Svg width={12} height={11} fill="none" {...props}>
    <Path
      clipRule="evenodd"
      d="M10.625 5.5a4.625 4.625 0 1 1-9.25 0 4.625 4.625 0 0 1 9.25 0Z"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M7.716 6.97 5.83 5.847V3.423" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default TimeWhiteSVG;
