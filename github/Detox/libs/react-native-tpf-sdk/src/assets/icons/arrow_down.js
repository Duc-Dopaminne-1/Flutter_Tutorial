import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={18}
      height={9}
      viewBox="0 0 18 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9 8.8c-.7 0-1.4-.27-1.93-.8L.55 1.48a.754.754 0 010-1.06c.29-.29.77-.29 1.06 0l6.52 6.52c.48.48 1.26.48 1.74 0L16.39.42c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06L10.93 8c-.53.53-1.23.8-1.93.8z"
        fill="#313131"
      />
    </Svg>
  );
}

export default SvgComponent;
