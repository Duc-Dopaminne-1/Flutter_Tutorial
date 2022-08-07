import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

function SvgComponent(props) {
  const { color1 = '#00B495', color2, background } = props;
  return (
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle cx={12.5} cy={12.5} r={7.5} fill="#fff" />
      <Path
        d="M12 2.25A9.75 9.75 0 1021.75 12 9.761 9.761 0 0012 2.25zm4.644 8.043l-5.5 5.25a.752.752 0 01-1.038 0l-2.75-2.625a.75.75 0 011.038-1.086l2.23 2.13 4.982-4.755a.75.75 0 011.038 1.086z"
        fill={color1}
      />
    </Svg>
  );
}

export default SvgComponent;
