import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

const MaleSVG = (props: SvgProps) => {
  const { color = '#CFD1D2' } = props;
  return (
    <Svg width={31} height={28} fill="none">
      <Circle cx={12.667} cy={14.666} r={11.667} stroke={color} strokeWidth={2} />
      <Path stroke={color} strokeWidth={2} strokeLinecap="round" d="m23.15 7.594 5.288-4.269M23.27 1.333l6.645.536-.536 6.645" />
    </Svg>
  );
};

export default MaleSVG;
