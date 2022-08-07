import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ICWallet(props, svgRef) {
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
        d="M3.6 5.16v12.48c0 .414.165.81.459 1.103.293.293.691.457 1.106.457h15.652a.784.784 0 00.783-.78V7.5a.779.779 0 00-.783-.78H5.165c-.415 0-.813-.164-1.106-.457A1.557 1.557 0 013.6 5.16zm0 0A1.568 1.568 0 015.165 3.6H18.47"
        stroke="#636466"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M16.95 14.775a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" fill="#636466" />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(ICWallet);
export default ForwardRef;
