import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ICGreenQuestion({ color1 = '#00B495', ...props }, svgRef) {
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      {...props}>
      <Path
        d="M7 11.033a.684.684 0 100-1.367.684.684 0 000 1.367zM7 3.514A2.19 2.19 0 004.812 5.7a.547.547 0 101.094 0 1.095 1.095 0 012.188 0c0 .603-.49 1.094-1.094 1.094a.547.547 0 00-.547.547v1.367a.547.547 0 101.094 0v-.89a2.191 2.191 0 001.64-2.118A2.19 2.19 0 007 3.514z"
        fill={color1}
      />
      <Path
        d="M7 0C3.131 0 0 3.13 0 7c0 3.869 3.13 7 7 7 3.869 0 7-3.13 7-7 0-3.869-3.13-7-7-7zm0 12.906A5.903 5.903 0 011.094 7 5.903 5.903 0 017 1.094 5.903 5.903 0 0112.906 7 5.903 5.903 0 017 12.906z"
        fill={color1}
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(ICGreenQuestion);
export default ForwardRef;
