import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const CloseSvg = (props: SvgProps) => {
  const { color = '#6F7579' } = props;
  return (
    <Svg width={24} height={24} fill="none">
      <Path d="M18 6 6 18M6 6l12 12" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default CloseSvg;
