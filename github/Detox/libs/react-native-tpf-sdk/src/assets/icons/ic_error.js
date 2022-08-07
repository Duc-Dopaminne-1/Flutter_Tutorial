import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle cx={12.5} cy={12.5} r={6.5} fill="#fff" />
      <Path
        d="M12 21.75A9.75 9.75 0 1121.75 12 9.762 9.762 0 0112 21.75zm3.53-12.22a.751.751 0 10-1.06-1.06L12 10.94 9.53 8.47a.75.75 0 00-1.06 1.06L10.94 12l-2.47 2.47a.75.75 0 001.06 1.06L12 13.06l2.47 2.47a.75.75 0 001.06-1.06L13.06 12l2.47-2.47z"
        fill="#EF413D"
      />
    </Svg>
  );
}

export default SvgComponent;
