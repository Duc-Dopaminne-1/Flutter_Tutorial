import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

const FemaleSVG = (props: SvgProps) => {
  const { color = '#CFD1D2' } = props;
  return (
    <Svg width={26} height={34} fill="none">
      <Circle cx={13} cy={12.667} r={11.667} stroke={color} strokeWidth={2} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 24.334c.614 0 1.112.497 1.112 1.11v6.667a1.111 1.111 0 1 1-2.222 0v-6.666c0-.614.497-1.111 1.11-1.111Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.445 28.222c0-.613.622-1.11 1.389-1.11h8.333c.767 0 1.389.497 1.389 1.11 0 .614-.622 1.112-1.389 1.112H8.834c-.767 0-1.39-.498-1.39-1.112Z"
        fill={color}
      />
    </Svg>
  );
};

export default FemaleSVG;
