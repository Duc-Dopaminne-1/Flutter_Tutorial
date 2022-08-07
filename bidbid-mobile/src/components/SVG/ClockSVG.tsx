import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ClockSVG = (props: SvgProps) => {
  const { color = '#575E62' } = props;
  return (
    <Svg width={18} height={18} fill="none">
      <Path
        clipRule="evenodd"
        d="M15.938 9A6.937 6.937 0 1 1 9 2.062 6.937 6.937 0 0 1 15.938 9Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M11.574 11.207 8.746 9.52V5.885" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default ClockSVG;
