import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const TickBlueSVG = () => (
  <Svg width={20} height={15} fill="none">
    <Path
      d="M19.707.293a1 1 0 0 0-1.414 0l-11.98 11.98L1.706 7.67A1 1 0 0 0 .293 9.082l5.312 5.312a1 1 0 0 0 1.414 0L19.707 1.707a1 1 0 0 0 0-1.414Z"
      fill="#2C93DD"
    />
  </Svg>
);

export default TickBlueSVG;
