import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const MapPinSVG = (props: SvgProps) => (
  <Svg width={10} height={12} fill="none" {...props}>
    <Path
      d="M4.994 10.099 7.52 7.574a3.57 3.57 0 1 0-5.05 0l2.525 2.525Zm0 1.442L1.748 8.295a4.59 4.59 0 1 1 6.492 0l-3.246 3.246Zm0-5.472a1.02 1.02 0 1 0 0-2.04 1.02 1.02 0 0 0 0 2.04Zm0 1.02a2.04 2.04 0 1 1 0-4.08 2.04 2.04 0 0 1 0 4.08Z"
      fill="#2C93DD"
    />
  </Svg>
);

export default MapPinSVG;
