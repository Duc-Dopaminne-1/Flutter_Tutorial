import * as React from 'react';
import Svg, { SvgProps, Rect, Mask, Path, G, Defs, ClipPath } from 'react-native-svg';

const IconGrayLogoutSVG = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Rect width={28} height={28} rx={14} fill="#CFD1D2" />
    <Mask id="a" x={5} y={5} width={18} height={18}>
      <Path fill="#C4C4C4" d="M5 5h18v18H5z" />
    </Mask>
    <G clipPath="url(#b)" fill="#fff">
      <Path d="M13.975 20.23H8.37a.623.623 0 0 1-.623-.624V8.394c0-.344.279-.623.623-.623h5.606a.622.622 0 1 0 0-1.246H8.37c-1.03 0-1.869.838-1.869 1.869v11.212c0 1.03.838 1.87 1.869 1.87h5.606a.622.622 0 1 0 0-1.247Z" />
      <Path d="M21.314 13.556 17.527 9.82a.623.623 0 1 0-.875.887l2.707 2.671h-7.253a.622.622 0 1 0 0 1.246h7.253l-2.707 2.671a.623.623 0 1 0 .875.887l3.787-3.738a.624.624 0 0 0 0-.886Z" />
    </G>
    <Defs>
      <ClipPath id="b">
        <Path fill="#fff" transform="translate(6.5 6.5)" d="M0 0h15v15H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default IconGrayLogoutSVG;
