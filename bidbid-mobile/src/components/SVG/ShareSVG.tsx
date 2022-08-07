import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';

const ShareSVG = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Rect width={28} height={28} rx={14} fill="#CFD1D2" />
    <Path
      d="M13.75 15.5h-1.5a6.75 6.75 0 0 0-5.976 3.608A7.5 7.5 0 0 1 13.75 11V6.875l7.875 6.375-7.875 6.375V15.5Zm-1.5-1.5h3v2.481l3.99-3.231-3.99-3.231V12.5h-1.5a5.987 5.987 0 0 0-4.543 2.08c.969-.384 2.001-.58 3.043-.58Z"
      fill="#fff"
    />
  </Svg>
);

export default ShareSVG;
