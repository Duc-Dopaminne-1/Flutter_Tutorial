import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const FilterSvg = () => (
  <Svg width={20} height={20} fill="none">
    <Path d="M8.117 15.987H.883" stroke="#101920" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path
      clipRule="evenodd"
      d="M19.117 15.986a2.88 2.88 0 1 1-5.76 0 2.88 2.88 0 0 1 5.76 0Z"
      stroke="#101920"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M11.883 4.262h7.235" stroke="#101920" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path
      clipRule="evenodd"
      d="M.883 4.262a2.88 2.88 0 1 0 5.76 0 2.88 2.88 0 1 0-5.76 0Z"
      stroke="#101920"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default FilterSvg;
