import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={56}
      height={56}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={28} cy={28} r={26} stroke="#E6E7E8" strokeWidth={4} />
      <Circle cx={28} cy={28} r={22} fill="#fff" />
    </Svg>
  );
}

export default SvgComponent;
