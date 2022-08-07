import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M14.425 4.859l-6.517 6.227c-.017.015-.034.033-.052.048a1.238 1.238 0 000 1.739l6.569 6.266c.475.481 1.243.481 1.718 0a1.238 1.238 0 000-1.738l-5.707-5.394L16.143 6.6a1.238 1.238 0 000-1.738 1.206 1.206 0 00-1.718-.002z"
        fill="#fff"
      />
    </Svg>
  );
}

export default SvgComponent;
