import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

const GenderOtherSVG = (props: SvgProps) => {
  const { color = '#CFD1D2' } = props;
  return (
    <Svg width={34} height={32} fill="none">
      <Path
        opacity={0.8}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 23.334a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z"
        fill={color}
      />
      <Path fillRule="evenodd" clipRule="evenodd" d="M13 26.834a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1Z" fill="#CFD1D2" />
      <Circle cx={17} cy={13.334} r={10} stroke={color} strokeWidth={2} />
      <Path
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        d="m26.278 7.8 4.824-4.104M25.936 1.667l6.646.536-.536 6.645M8.362 7.8 3.54 3.696M8.704 1.667l-6.645.536.536 6.645M7.294 4.406l-2.202 2.72"
      />
    </Svg>
  );
};

export default GenderOtherSVG;
