import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';

const IconGrayPaymentSVG = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Rect width={28} height={28} rx={14} fill="#CFD1D2" />
    <Path
      d="m11.514 8 1.956-1.955a.75.75 0 0 1 1.06 0L16.485 8h2.765a.75.75 0 0 1 .75.75v2.764l1.955 1.956a.75.75 0 0 1 0 1.06L20 16.485v2.765a.75.75 0 0 1-.75.75h-2.765l-1.955 1.955a.75.75 0 0 1-1.06 0L11.514 20H8.75a.75.75 0 0 1-.75-.75v-2.765L6.045 14.53a.75.75 0 0 1 0-1.06L8 11.514V8.75A.75.75 0 0 1 8.75 8h2.764ZM9.5 9.5v2.636L7.636 14 9.5 15.864V18.5h2.636L14 20.364l1.864-1.864H18.5v-2.636L20.364 14 18.5 12.136V9.5h-2.636L14 7.636 12.136 9.5H9.5ZM14 17a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      fill="#fff"
    />
  </Svg>
);

export default IconGrayPaymentSVG;
