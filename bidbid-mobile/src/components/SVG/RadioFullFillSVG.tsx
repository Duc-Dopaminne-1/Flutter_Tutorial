import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';

const RadioFullFillSVG = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <Rect x={0.5} y={0.5} width={15} height={15} rx={7.5} fill="#fff" stroke="#2C93DD" />
    <Path fillRule="evenodd" clipRule="evenodd" d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="#2C93DD" />
  </Svg>
);

export default RadioFullFillSVG;
