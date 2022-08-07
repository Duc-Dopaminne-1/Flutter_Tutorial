import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const NextSVG = (props: SvgProps) => {
  const { color = '#101920', height = 14, width = 14 } = props;
  return (
    <Svg width={width} height={height} fill="none" {...props}>
      <Path d="m1 13 6-6-6-6" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default NextSVG;
