import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const LocationSVG = (props: SvgProps) => (
  <Svg width={14} height={17} fill="none" {...props}>
    <Path
      d="m7 14.675 3.713-3.713a5.25 5.25 0 1 0-7.425 0L7 14.675Zm0 2.12-4.773-4.772a6.75 6.75 0 1 1 9.546 0L7 16.796ZM7 8.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 1.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
      fill="#575E62"
    />
  </Svg>
);

export default LocationSVG;
