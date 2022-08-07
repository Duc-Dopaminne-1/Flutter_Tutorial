import * as React from 'react';
import Svg, { SvgProps, Mask, Path, G, Defs, ClipPath } from 'react-native-svg';

const IconCardDefaultSVG = (props: SvgProps) => (
  <Svg width={36} height={24} fill="none" {...props}>
    <Mask id="a" x={0} y={0} width={36} height={24}>
      <Path fill="#C4C4C4" d="M0 0h36v24H0z" />
    </Mask>
    <G clipPath="url(#b)" fill="#2C93DD" mask="url(#a)">
      <Path d="M29.875 2H6.125A3.13 3.13 0 0 0 3 5.125v13.75A3.13 3.13 0 0 0 6.125 22h23.75A3.13 3.13 0 0 0 33 18.875V5.125A3.13 3.13 0 0 0 29.875 2Zm1.875 16.875a1.877 1.877 0 0 1-1.875 1.875H6.125a1.877 1.877 0 0 1-1.875-1.875V5.125c0-1.034.841-1.875 1.875-1.875h23.75c1.034 0 1.875.841 1.875 1.875v13.75Z" />
      <Path d="M32.375 5.75H3.625A.625.625 0 0 0 3 6.375v3.75c0 .345.28.625.625.625h28.75c.345 0 .625-.28.625-.625v-3.75a.625.625 0 0 0-.625-.625ZM31.75 9.5H4.25V7h27.5v2.5ZM14.875 14.5h-7.5a.625.625 0 0 0 0 1.25h7.5a.625.625 0 0 0 0-1.25ZM14.875 17h-7.5a.625.625 0 0 0 0 1.25h7.5a.625.625 0 0 0 0-1.25ZM27.375 13.25h-1.25a1.877 1.877 0 0 0-1.875 1.875v1.25c0 1.034.841 1.875 1.875 1.875h1.25a1.877 1.877 0 0 0 1.875-1.875v-1.25a1.877 1.877 0 0 0-1.875-1.875ZM28 16.375c0 .345-.28.625-.625.625h-1.25a.625.625 0 0 1-.625-.625v-1.25c0-.345.28-.625.625-.625h1.25c.345 0 .625.28.625.625v1.25Z" />
    </G>
    <Defs>
      <ClipPath id="b">
        <Path fill="#fff" transform="translate(3 -3)" d="M0 0h30v30H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default IconCardDefaultSVG;
