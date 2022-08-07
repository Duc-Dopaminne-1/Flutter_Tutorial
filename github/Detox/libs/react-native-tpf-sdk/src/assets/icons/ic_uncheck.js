import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';

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
      <Rect
        x="1"
        y="1"
        width="18"
        height="18"
        rx="3"
        fill="white"
        stroke="#939598"
        stroke-width="2"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(Component);
export default ForwardRef;
