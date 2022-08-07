import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';

const IconGrayLocationSVG = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Rect width={28} height={28} rx={14} fill="#CFD1D2" />
    <Path
      d="m14 20.675 3.712-3.713a5.25 5.25 0 1 0-7.425 0L14 20.675Zm0 2.12-4.773-4.772a6.75 6.75 0 1 1 9.546 0L14 22.796Zm0-8.045a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 1.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
      fill="#fff"
    />
  </Svg>
);

export default IconGrayLocationSVG;
