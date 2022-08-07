import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props, svgRef) {
  const { color1 = '#00B495' } = props;
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
        d="M19.5 3h-2.25v-.75a.75.75 0 10-1.5 0V3h-7.5v-.75a.75.75 0 10-1.5 0V3H4.5A1.501 1.501 0 003 4.5v15A1.501 1.501 0 004.5 21h15a1.502 1.502 0 001.5-1.5v-15A1.502 1.502 0 0019.5 3zm0 4.5h-15v-3h2.25v.75a.75.75 0 001.5 0V4.5h7.5v.75a.75.75 0 101.5 0V4.5h2.25v3z"
        fill={color1}
        {...props}
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgComponent);
export default ForwardRef;
