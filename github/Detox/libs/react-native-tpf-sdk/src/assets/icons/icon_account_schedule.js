import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8 10a4 4 0 100-8 4 4 0 000 8z"
        stroke="#636466"
        strokeWidth={1.2}
        strokeMiterlimit={10}
      />
      <Path
        d="M1.937 13.5a7.003 7.003 0 0112.126 0"
        stroke="#636466"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
