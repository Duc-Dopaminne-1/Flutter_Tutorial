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
        d="M3.946 4.5h16.109a.75.75 0 01.555 1.255l-6.165 6.78a.75.75 0 00-.195.505v5.309a.75.75 0 01-.334.624l-3 2a.75.75 0 01-1.166-.624V13.04a.75.75 0 00-.195-.504L3.391 5.755A.75.75 0 013.946 4.5v0z"
        stroke="#0B2520"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
