import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

const TickTimeSVG = (props: SvgProps) => (
  <Svg width={14} height={14} fill="none" {...props}>
    <G clipPath="url(#a)" fill="#6F7579">
      <Path d="M6.417 13.408A6.424 6.424 0 0 1 0 6.99 6.424 6.424 0 0 1 6.417.575c1.23 0 2.427.35 3.46 1.014a.438.438 0 0 1-.472.737 5.517 5.517 0 0 0-2.988-.876A5.548 5.548 0 0 0 .875 6.99a5.548 5.548 0 0 0 5.542 5.542 5.548 5.548 0 0 0 5.515-6.083.437.437 0 1 1 .871-.085 6.424 6.424 0 0 1-6.387 7.042Z" />
      <Path d="M7.146 8.45a.434.434 0 0 1-.31-.129L4.213 5.696a.438.438 0 0 1 .619-.619l2.315 2.316 6.107-6.107a.438.438 0 0 1 .619.62L7.455 8.321a.438.438 0 0 1-.31.127Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h14v14H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default TickTimeSVG;
