import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props, svgRef) {
  const { color1 = '#00B495' } = props;
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
        d="M20.81 14.852l-4.391-1.881a1.496 1.496 0 00-1.423.13l-2.348 1.565a7.176 7.176 0 01-3.3-3.286l1.56-2.383a1.496 1.496 0 00.123-1.412L9.147 3.19a1.503 1.503 0 00-1.56-.898A5.257 5.257 0 003 7.5C3 14.944 9.056 21 16.5 21a5.257 5.257 0 005.208-4.586 1.503 1.503 0 00-.898-1.562zM14.752 4.474a6.761 6.761 0 014.774 4.774.75.75 0 001.449-.387 8.265 8.265 0 00-5.836-5.836.75.75 0 00-.387 1.45zM13.975 7.373a3.756 3.756 0 012.652 2.652.75.75 0 001.449-.387 5.26 5.26 0 00-3.714-3.714.75.75 0 00-.387 1.449z"
        fill={color1}
        {...props}
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgComponent);
export default ForwardRef;
