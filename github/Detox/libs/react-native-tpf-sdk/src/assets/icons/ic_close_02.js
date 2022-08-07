import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import themeContext from '../../constants/theme/themeContext';

function SvgComponent(props) {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9 .875C4.52.875.875 4.52.875 9S4.52 17.125 9 17.125 17.125 13.48 17.125 9 13.48.875 9 .875zm2.942 10.183a.624.624 0 11-.884.884L9 9.884l-2.058 2.058a.625.625 0 01-.884-.884L8.116 9 6.058 6.942a.625.625 0 01.884-.884L9 8.116l2.058-2.058a.625.625 0 01.884.884L9.884 9l2.058 2.058z"
        fill="#fff"
      />
    </Svg>
  );
}

export default SvgComponent;
