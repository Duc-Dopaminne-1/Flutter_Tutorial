import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const IconCalendarSVG = (props: SvgProps) => (
  <Svg width={20} height={23} fill="none" {...props}>
    <Path
      d="M1.092 8.904h17.824M14.443 12.81h.01M10.005 12.81h.01M5.558 12.81h.01M14.443 16.696h.01M10.005 16.696h.01M5.558 16.696h.01M14.043 1.5v3.29M5.965 1.5v3.29"
      stroke="#6F7579"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      clipRule="evenodd"
      d="M14.238 3.08H5.771C2.834 3.08 1 4.714 1 7.721v9.05C1 19.826 2.834 21.5 5.771 21.5h8.458c2.946 0 4.771-1.645 4.771-4.653V7.722c.01-3.007-1.816-4.643-4.762-4.643Z"
      stroke="#6F7579"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IconCalendarSVG;
