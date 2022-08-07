import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';

const FbSquareSVG = (props: SvgProps) => (
  <Svg width={40} height={40} fill="none" {...props}>
    <Rect width={40} height={40} rx={10} fill="#4A7AFF" />
    <Path
      d="M25.985 8.587v3.517s-4.14-.586-4.14 2.02v2.605h3.74l-.468 3.974h-3.271V31.06h-4.14V20.703l-3.539-.065v-3.909h3.472v-2.996s-.23-4.458 4.273-5.276c1.87-.34 4.073.13 4.073.13Z"
      fill="#fff"
    />
  </Svg>
);

export default FbSquareSVG;
