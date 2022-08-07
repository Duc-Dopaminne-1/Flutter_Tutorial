import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={28}
      height={24}
      viewBox="0 0 28 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M24 0H4a4.004 4.004 0 00-4 4v16a4.004 4.004 0 004 4h20a4.004 4.004 0 004-4V4a4.005 4.005 0 00-4-4zm-5 4a3 3 0 110 6 3 3 0 010-6zM4 22a2 2 0 01-2-2v-4.227l5.928-5.269a3.004 3.004 0 014.112.12l4.06 4.05L8.772 22H4zm22-2a2 2 0 01-2 2H11.602l7.589-7.589a2.982 2.982 0 013.852-.01L26 16.865V20z"
        fill="#E6E7E8"
      />
    </Svg>
  );
}

export default SvgComponent;
