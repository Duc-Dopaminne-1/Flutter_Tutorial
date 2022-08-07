import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

function SvgComponent({ color1 = '#CCD1D9', ...props }) {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect
        x={0.5}
        y={0.5}
        width={47}
        height={47}
        rx={7.5}
        fill="#F5F7FA"
        stroke={color1}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 8"
      />
      <Path
        d="M19.953 24.25h8.594M24.25 19.953v8.594"
        stroke={color1}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
