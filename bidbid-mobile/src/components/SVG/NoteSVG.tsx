import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const NoteSVG = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <Path
      d="M6 6.667C6 6.298 6.298 6 6.667 6H8c.368 0 .667.298.667.667V10H10a.667.667 0 0 1 0 1.333H6A.667.667 0 1 1 6 10h1.333V7.333h-.666A.667.667 0 0 1 6 6.667ZM7.667 5.333a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      fill="#575E62"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.667a6.667 6.667 0 1 0 0 13.334A6.667 6.667 0 0 0 8 1.333Z"
      fill="#575E62"
    />
  </Svg>
);

export default NoteSVG;
