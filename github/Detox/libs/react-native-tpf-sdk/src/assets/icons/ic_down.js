import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={12}
      height={8}
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M2.08.791A.8.8 0 00.95.806a.813.813 0 000 1.138l5.084 5.182L11.05 1.94a.819.819 0 00-.258-1.319.793.793 0 00-.87.168L6.05 4.63 2.08.791z"
        fill="#005E52"
        {...props}
      />
    </Svg>
  );
}

export default SvgComponent;
