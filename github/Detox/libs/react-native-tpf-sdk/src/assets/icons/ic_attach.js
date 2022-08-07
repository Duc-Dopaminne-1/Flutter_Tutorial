import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={22}
      height={23}
      viewBox="0 0 22 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8.528 15.531H6.12a4.105 4.105 0 01-2.885-1.18A4.007 4.007 0 012.04 11.5c0-1.07.43-2.095 1.195-2.85A4.105 4.105 0 016.12 7.468h2.355M13.286 7.469h2.355c1.082 0 2.12.424 2.885 1.18A4.007 4.007 0 0119.72 11.5c0 1.07-.43 2.095-1.195 2.85a4.105 4.105 0 01-2.885 1.181h-2.409M7.186 11.5h7.474"
        stroke="#1D1B1B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
