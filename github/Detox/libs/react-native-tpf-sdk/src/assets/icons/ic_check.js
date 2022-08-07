import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

function Component(props, svgRef) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      {...props}>
      <Rect width="20" height="20" rx="4" fill="#00B495" {...props} />
      <Path
        d="M16.6668 5L7.50016 14.1667L3.3335 10"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(Component);
export default ForwardRef;
