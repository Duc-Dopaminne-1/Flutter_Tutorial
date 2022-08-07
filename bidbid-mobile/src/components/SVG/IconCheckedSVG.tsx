import * as React from 'react';
import Svg, { SvgProps, Mask, Path, G } from 'react-native-svg';

const IconCheckedSVG = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Mask id="a" x={0} y={0} width={24} height={24}>
      <Path fill="#C4C4C4" d="M0 0h24v24H0z" />
    </Mask>
    <G mask="url(#a)">
      <Path
        d="M21.707 5.293a1 1 0 0 0-1.414 0l-11.98 11.98-4.606-4.604a1 1 0 1 0-1.414 1.414l5.312 5.312a1 1 0 0 0 1.414 0L21.707 6.707a1 1 0 0 0 0-1.414Z"
        fill="#2C93DD"
      />
    </G>
  </Svg>
);

export default IconCheckedSVG;
