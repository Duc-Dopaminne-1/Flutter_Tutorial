import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
        stroke="#005E52"
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />
      <Path
        d="M15.898 16.5a4.502 4.502 0 00-7.796 0"
        stroke="#F08C31"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.625 11.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM15.375 11.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
        fill="#005E52"
      />
      <Path
        d="M8.625 11.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM15.375 11.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
        fill="#005E52"
      />
    </Svg>
  );
}

export default SvgComponent;
