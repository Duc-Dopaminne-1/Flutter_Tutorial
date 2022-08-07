import * as React from 'react';
import Svg, { SvgProps, Rect, Mask, Path, G, Defs, ClipPath } from 'react-native-svg';

const IconGrayShowMeSVG = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Rect width={28} height={28} rx={14} fill="#CFD1D2" />
    <Mask id="a" x={5} y={5} width={18} height={18}>
      <Path fill="#C4C4C4" d="M5 5h18v18H5z" />
    </Mask>
    <G clipPath="url(#b)" fill="#fff">
      <Path d="M21.405 13.708C21.27 13.525 18.078 9.22 14 9.22s-7.271 4.305-7.405 4.488a.495.495 0 0 0 0 .584c.134.183 3.327 4.488 7.405 4.488s7.27-4.305 7.405-4.488a.494.494 0 0 0 0-.584ZM14 17.791c-3.004 0-5.605-2.857-6.376-3.791.77-.935 3.366-3.791 6.376-3.791 3.004 0 5.605 2.857 6.375 3.791-.769.935-3.365 3.791-6.375 3.791Z" />
      <Path d="M14 11.033A2.97 2.97 0 0 0 11.033 14 2.97 2.97 0 0 0 14 16.967 2.97 2.97 0 0 0 16.967 14 2.97 2.97 0 0 0 14 11.033Zm0 4.945A1.98 1.98 0 0 1 12.022 14 1.98 1.98 0 0 1 14 12.022 1.98 1.98 0 0 1 15.978 14 1.98 1.98 0 0 1 14 15.978Z" />
    </G>
    <Defs>
      <ClipPath id="b">
        <Path fill="#fff" transform="translate(6.5 6.5)" d="M0 0h15v15H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default IconGrayShowMeSVG;
