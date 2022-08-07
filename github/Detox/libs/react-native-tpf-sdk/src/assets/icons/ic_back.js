import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Component(props, svgRef) {
  return (
    <Svg
      width={10}
      height={20}
      viewBox="0 0 10 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.53.55a.75.75 0 010 1.06L2.01 8.13a1.236 1.236 0 000 1.74l6.52 6.52a.75.75 0 11-1.06 1.06L.95 10.93a2.736 2.736 0 010-3.86L7.47.55a.75.75 0 011.06 0z"
        fill={props.color1 || '#FF951F'}
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(Component);
export default ForwardRef;
