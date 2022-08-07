import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const IconTimeSVG = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      clipRule="evenodd"
      d="M21.25 12.001a9.25 9.25 0 0 1-9.25 9.25 9.25 9.25 0 0 1-9.25-9.25A9.25 9.25 0 0 1 12 2.751a9.25 9.25 0 0 1 9.25 9.25Z"
      stroke="#575E62"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="m15.431 14.944-3.77-2.25V7.849" stroke="#575E62" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default IconTimeSVG;
