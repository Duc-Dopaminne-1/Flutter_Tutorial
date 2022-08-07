import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ArrowDownSVG = () => (
  <Svg width={10} height={6} fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m1 1 4 4 4-4H1Z"
      fill="#F9423A"
      stroke="#F9423A"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowDownSVG;
