import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent({ color1 = '#00B495', ...props }) {
  return (
    <Svg
      width={6}
      height={10}
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M1.5 1.25L5.25 5 1.5 8.75"
        stroke={color1}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
