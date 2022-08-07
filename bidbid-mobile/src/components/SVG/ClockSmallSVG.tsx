import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ClockSmallSVG = () => {
  return (
    <Svg width={14} height={15} fill="none">
      <Path
        clipRule="evenodd"
        d="M12.396 7.433a5.396 5.396 0 1 1-10.791 0 5.396 5.396 0 0 1 10.79 0Z"
        stroke="#6F7579"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="m9.002 9.15-2.2-1.313V5.01" stroke="#6F7579" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default ClockSmallSVG;
