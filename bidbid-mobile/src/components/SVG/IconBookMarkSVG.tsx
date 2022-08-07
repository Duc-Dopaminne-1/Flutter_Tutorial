import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const IconBookMarkSVG = (props: SvgProps) => (
  <Svg width={10} height={10} fill="none" {...props}>
    <Path
      d="M2.083.833h5.833a.417.417 0 0 1 .417.417v7.976a.208.208 0 0 1-.319.177L5 7.513l-3.014 1.89a.208.208 0 0 1-.32-.177V1.25a.417.417 0 0 1 .417-.417Zm5.417.833h-5v6.43L5 6.53l2.5 1.567v-6.43Z"
      fill="#fff"
    />
  </Svg>
);

export default IconBookMarkSVG;
