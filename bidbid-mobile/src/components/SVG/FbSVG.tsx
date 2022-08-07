import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const FbSVG = (props: SvgProps) => (
  <Svg width={48} height={48} fill="none" {...props}>
    <Path d="M48 24c0 13.255-10.745 24-24 24S0 37.255 0 24 10.745 0 24 0s24 10.745 24 24Z" fill="#4A7AFF" />
    <Path
      d="M31.09 10.668v4.221s-4.968-.703-4.968 2.424v3.126h4.487l-.56 4.769h-3.927v12.428h-4.967V25.208l-4.247-.079v-4.69h4.167v-3.595s-.275-5.35 5.128-6.332c2.243-.408 4.887.156 4.887.156Z"
      fill="#fff"
    />
  </Svg>
);

export default FbSVG;
