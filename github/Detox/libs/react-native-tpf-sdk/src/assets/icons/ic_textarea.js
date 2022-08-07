import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props, svgRef) {
  return (
    <Svg
      width={14}
      height={13}
      viewBox="0 0 6 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      {...props}>
      <Path
        stroke="#8DAA9B"
        strokeWidth={0.7}
        strokeLinecap="round"
        d="M1.159 8.48L9.199.44M4.573 8.48l4.626-4.626M7.987 8.48l1.639-1.639"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgComponent);
export default ForwardRef;
