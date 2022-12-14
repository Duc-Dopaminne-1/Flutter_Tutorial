import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const LinkWhiteSVG = () => (
  <Svg width={16} height={16} fill="none">
    <Path
      d="M10.862 9.138c.26.26.682.26.942 0l1.334-1.334a3.495 3.495 0 0 0-4.943-4.942L6.862 4.195a.667.667 0 1 0 .942.943l1.334-1.334a2.162 2.162 0 1 1 3.057 3.058l-1.333 1.333a.667.667 0 0 0 0 .943ZM2.862 13.138a3.495 3.495 0 0 0 4.942 0l1.334-1.334a.667.667 0 1 0-.943-.942l-1.333 1.333a2.162 2.162 0 1 1-3.058-3.057l1.334-1.334a.667.667 0 1 0-.943-.942L2.862 8.195a3.495 3.495 0 0 0 0 4.943Z"
      fill="#fff"
    />
    <Path d="M6.471 10.471a.667.667 0 0 1-.943-.943l4-4a.667.667 0 0 1 .943.943l-4 4Z" fill="#fff" />
  </Svg>
);

export default LinkWhiteSVG;
