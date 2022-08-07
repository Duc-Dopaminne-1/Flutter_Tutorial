import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';

const EditDotSVG = () => (
  <Svg width={24} height={24} fill="none">
    <Circle cx={12} cy={6} r={2} fill="#575E62" />
    <Circle cx={12} cy={12} r={2} fill="#575E62" />
    <Circle cx={12} cy={18} r={2} fill="#575E62" />
  </Svg>
);

export default EditDotSVG;
