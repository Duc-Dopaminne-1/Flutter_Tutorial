import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';

function ICShareNetwork(props, svgRef) {
  const { color1 } = props;
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle
        cx={12}
        cy={12}
        r={11.25}
        fill={color1 || '#FF951F'}
        stroke={color1 || '#FF951F'}
        strokeWidth={1.5}
      />
      <Circle cx={12} cy={12} r={4.8} fill="#fff" />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(ICShareNetwork);
export default ForwardRef;
