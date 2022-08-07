import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';

const CheckedSVG = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <Rect width={16} height={16} rx={2} fill="#2C93DD" />
    <Path
      d="M3.913 7.035a.525.525 0 0 1 .412.2l-.412-.2Zm0 0h-.82a.243.243 0 0 0-.19.394l3.21 4.067c.21.266.613.265.824 0l5.723-7.252a.243.243 0 0 0-.191-.394h-.82a.523.523 0 0 0-.411.2l-4.714 5.972m-2.61-2.987 2.61 2.987m0 0L4.325 7.235l2.199 2.787Z"
      fill="#fff"
      stroke="#fff"
      strokeWidth={0.3}
    />
  </Svg>
);

export default CheckedSVG;
