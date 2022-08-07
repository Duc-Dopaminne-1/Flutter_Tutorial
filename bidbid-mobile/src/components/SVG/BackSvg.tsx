import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const IconBack = (props: SvgProps) => {
  const { color = '#575E62' } = props;
  return (
    <Svg width={18} height={15} fill="none">
      <Path
        d="M1.25 7.274h16M7.3 13.299 1.25 7.275 7.3 1.25"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export default IconBack;
