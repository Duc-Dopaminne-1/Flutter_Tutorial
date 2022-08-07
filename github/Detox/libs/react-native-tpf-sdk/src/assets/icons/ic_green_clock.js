import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props, svgRef) {
  const { color1 = '#005E52' } = props;
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
        d="M15.564 13.766l-2.788-2.091v-4.26a.774.774 0 10-1.55 0v4.647c0 .244.115.474.31.62l3.099 2.323a.77.77 0 00.464.155.773.773 0 00.465-1.394z"
        fill={color1}
        {...props}
      />
      <Path
        d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18.45c-4.66 0-8.45-3.79-8.45-8.45 0-4.66 3.79-8.45 8.45-8.45 4.66 0 8.45 3.79 8.45 8.45 0 4.66-3.79 8.45-8.45 8.45z"
        fill={color1}
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgComponent);
export default ForwardRef;
