import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props, svgRef) {
  const { color1 } = props;
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
        d="M19.75 7L9.25 17.5 4 12.25"
        stroke={color1}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgComponent);
export default ForwardRef;
