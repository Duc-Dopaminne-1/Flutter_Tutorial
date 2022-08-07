import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

function SvgComponent(props) {
  const { color1 = '#178C77', color2 } = props;
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={48} height={48} rx={8} fill="#F3F9F8" />
      <Path
        d="M15 27.75l4.72-4.72a.75.75 0 011.06 0l4.19 4.19a.75.75 0 001.06 0l1.94-1.94a.75.75 0 011.06 0L33 29.25"
        stroke={color1}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M32.25 16.5h-16.5a.75.75 0 00-.75.75v13.5c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75v-13.5a.75.75 0 00-.75-.75z"
        stroke={color1}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M27.688 21.375a1.063 1.063 0 11-2.126 0 1.063 1.063 0 012.125 0z"
        fill={color1}
        stroke={color1}
        strokeWidth={0.125}
      />
    </Svg>
  );
}

export default SvgComponent;
