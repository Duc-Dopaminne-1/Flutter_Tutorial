import * as React from 'react';
import Svg, { Mask, Path, G, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';

function SvgComponent(props, svgRef) {
  return (
    <Svg
      width={46}
      height={46}
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M23 0a23 23 0 1023 23A23.026 23.026 0 0023 0zm0 10.615a2.654 2.654 0 110 5.308 2.654 2.654 0 010-5.308zm1.77 24.77H23a1.768 1.768 0 01-1.77-1.77V23a1.77 1.77 0 110-3.538H23a1.77 1.77 0 011.77 1.769v10.615a1.77 1.77 0 110 3.539z"
        fill="#FFC600"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgComponent);
export default ForwardRef;
