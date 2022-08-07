import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const FacebookShareSVG = () => (
  <Svg width={30} height={30} fill="none">
    <Path d="M30 15c0 8.284-6.716 15-15 15-8.284 0-15-6.716-15-15C0 6.716 6.716 0 15 0c8.284 0 15 6.716 15 15Z" fill="#4A7AFF" />
    <Path
      d="M19.432 6.668v2.638s-3.105-.44-3.105 1.515v1.954h2.804l-.35 2.98h-2.454v7.768h-3.105v-7.768l-2.654-.049v-2.931h2.604v-2.248s-.171-3.343 3.205-3.957c1.403-.255 3.055.098 3.055.098Z"
      fill="#fff"
    />
  </Svg>
);

export default FacebookShareSVG;
