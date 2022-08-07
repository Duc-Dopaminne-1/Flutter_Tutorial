import * as React from 'react';
import Svg, { SvgProps, Rect } from 'react-native-svg';

const NotiSVG = (props: SvgProps) => (
  <Svg width={24} height={14} fill="none" {...props}>
    <Rect width={24} height={14} rx={7} fill="#F9423A" />
  </Svg>
);

export default NotiSVG;
