import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={18}
      height={12}
      viewBox="0 0 18 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.547.487a.75.75 0 01-.034 1.06l-10.673 10a.75.75 0 01-1.026 0l-5.327-5a.75.75 0 111.026-1.094l4.815 4.519 10.16-9.52a.75.75 0 011.06.035z"
        fill="#fff"
      />
    </Svg>
  );
}

export default SvgComponent;
