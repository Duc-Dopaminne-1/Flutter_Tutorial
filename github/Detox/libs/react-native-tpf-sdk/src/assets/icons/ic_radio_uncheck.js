import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';

function ICShareNetwork(props, svgRef) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={12} cy={12} r={11.25} fill="#fff" stroke="#CCD1D9" strokeWidth={1.5} />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(ICShareNetwork);
export default ForwardRef;
