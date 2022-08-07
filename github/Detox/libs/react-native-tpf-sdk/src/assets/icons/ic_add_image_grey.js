import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={48} height={48} rx={8} fill="#F5F6F8" />
      <Rect
        x={0.5}
        y={0.5}
        width={47}
        height={47}
        rx={7.5}
        stroke="#0B2520"
        strokeOpacity={0.2}
        strokeDasharray="2 2"
      />
      <Path
        d="M19.953 24.25h8.594M24.25 19.953v8.594"
        stroke="#005E52"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
