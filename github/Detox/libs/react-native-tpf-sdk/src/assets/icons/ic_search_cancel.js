import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M13.66 2.34C10.539-.78 5.46-.78 2.34 2.34c-3.12 3.121-3.12 8.199 0 11.32 3.121 3.12 8.2 3.12 11.32 0 3.12-3.12 3.12-8.199 0-11.32zm-2.337 8.245a.522.522 0 01-.739.738L8 8.739l-2.584 2.584a.522.522 0 11-.738-.739L7.262 8 4.678 5.416a.522.522 0 01.738-.738L8 7.262l2.585-2.584a.522.522 0 01.738.738L8.739 8l2.584 2.585z"
        fill="#A8C1C7"
      />
    </Svg>
  );
}

export default SvgComponent;
