import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

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
        d="M20.177 11.873H3.824a.186.186 0 000 .372h16.353a.186.186 0 000-.372z"
        fill="#F48220"
        stroke="#F58220"
        strokeWidth={0.5}
      />
      <Path
        d="M12 3.697a.186.186 0 00-.186.186v5.87L10.273 8.21a.186.186 0 10-.263.263l1.858 1.858a.178.178 0 00.124.052h.013a.18.18 0 00.125-.053l1.858-1.858a.186.186 0 10-.263-.263l-1.539 1.542v-5.87A.186.186 0 0012 3.698zM12 20.42a.185.185 0 00.186-.185v-5.87l1.541 1.542a.185.185 0 00.265.002.186.186 0 00-.002-.265l-1.858-1.858a.185.185 0 00-.26 0l-1.858 1.858a.186.186 0 00.263.263l1.541-1.541v5.865a.188.188 0 00.111.174c.022.01.047.015.071.016z"
        fill="#265A37"
        stroke="#265A37"
        strokeWidth={0.4}
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgComponent);
export default ForwardRef;
