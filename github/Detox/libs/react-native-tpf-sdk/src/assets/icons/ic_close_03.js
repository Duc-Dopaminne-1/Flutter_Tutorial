import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent({ color1 = '#939598', ...props }) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8 0C3.589 0 0 3.589 0 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm2.896 10.027a.615.615 0 11-.87.87L8 8.87l-2.027 2.027a.615.615 0 01-.87-.87L7.13 8 5.103 5.973a.615.615 0 01.87-.87L8 7.13l2.027-2.027a.616.616 0 01.87.87L8.87 8l2.027 2.027z"
        fill={color1}
      />
    </Svg>
  );
}

export default SvgComponent;
