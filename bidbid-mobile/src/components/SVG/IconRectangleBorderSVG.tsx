import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const IconRectangleBorderSVG = (props: SvgProps) => (
  <Svg width={162} height={162} fill="none" {...props}>
    <Path
      d="M45.444 1H17C8.163 1 1 8.163 1 17v28.444M116.556 1H145c8.837 0 16 7.163 16 16v28.444M116.556 161H145c8.837 0 16-7.163 16-16v-28.444M45.444 161H17c-8.837 0-16-7.163-16-16v-28.444"
      stroke="#F9423A"
      strokeLinecap="round"
    />
  </Svg>
);

export default IconRectangleBorderSVG;
