import * as React from 'react';
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

function SvgComponent(props, svgRef) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      {...props}>
      <Path
        d="M3 15.75l4.72-4.72a.75.75 0 011.06 0l4.19 4.19a.75.75 0 001.06 0l1.94-1.94a.75.75 0 011.06 0L21 17.25"
        stroke="#178C77"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.25 4.5H3.75a.75.75 0 00-.75.75v13.5c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75z"
        stroke="#178C77"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M14.625 10.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" fill="#178C77" />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgComponent);
export default ForwardRef;
