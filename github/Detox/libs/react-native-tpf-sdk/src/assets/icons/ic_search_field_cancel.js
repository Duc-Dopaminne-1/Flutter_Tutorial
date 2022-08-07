import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M10 1.875C5.52 1.875 1.875 5.52 1.875 10S5.52 18.125 10 18.125 18.125 14.48 18.125 10 14.48 1.875 10 1.875zm2.942 10.183a.624.624 0 11-.884.884L10 10.884l-2.058 2.058a.625.625 0 01-.884-.884L9.116 10 7.058 7.942a.625.625 0 01.884-.884L10 9.116l2.058-2.058a.625.625 0 01.884.884L10.884 10l2.058 2.058z"
        fill="#939598"
      />
    </Svg>
  );
}

export default SvgComponent;
