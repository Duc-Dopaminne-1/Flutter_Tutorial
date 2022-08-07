import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  const { color1 = '#26894F' } = props;
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.53 1.53A.75.75 0 0014.47.47L8 6.94 1.53.47A.75.75 0 00.47 1.53L6.94 8 .47 14.47a.75.75 0 101.06 1.06L8 9.06l6.47 6.47a.75.75 0 101.06-1.06L9.06 8l6.47-6.47z"
        fill={color1}
      />
    </Svg>
  );
}

export default SvgComponent;
