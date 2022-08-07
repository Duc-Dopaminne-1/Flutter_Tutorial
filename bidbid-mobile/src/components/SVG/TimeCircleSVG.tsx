import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const TimeCircleSVG = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <Path
      clipRule="evenodd"
      d="M19.25 10.001a9.25 9.25 0 0 1-9.25 9.25 9.25 9.25 0 0 1-9.25-9.25A9.25 9.25 0 0 1 10 .751a9.25 9.25 0 0 1 9.25 9.25Z"
      stroke="#101920"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="m13.432 12.944-3.77-2.25V5.849" stroke="#101920" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default TimeCircleSVG;
