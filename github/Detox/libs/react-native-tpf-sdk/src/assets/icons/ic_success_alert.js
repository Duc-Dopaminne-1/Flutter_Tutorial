import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={56}
      height={56}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M28 4.666c-12.857 0-23.334 10.477-23.334 23.333 0 12.857 10.477 23.334 23.333 23.334 12.857 0 23.334-10.477 23.334-23.334 0-12.856-10.477-23.333-23.334-23.333zm11.153 17.967l-13.23 13.23a1.748 1.748 0 01-2.474 0l-6.603-6.604a1.76 1.76 0 010-2.473 1.76 1.76 0 012.473 0l5.367 5.367 11.993-11.994a1.76 1.76 0 012.474 0c.676.677.676 1.774 0 2.474z"
        fill="#449460"
      />
    </Svg>
  );
}

export default SvgComponent;
