import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import themeContext from '../../constants/theme/themeContext';

function SvgComponent(props) {
  const theme = React.useContext(themeContext);
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={10} cy={10} r={9} stroke="#fff" strokeWidth={2} />
      <Path
        d="M10 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm2.896 10.027a.615.615 0 11-.87.87L10 10.87l-2.027 2.027a.615.615 0 01-.87-.87L9.13 10 7.103 7.973a.615.615 0 01.87-.87L10 9.13l2.027-2.027a.616.616 0 01.87.87L10.87 10l2.027 2.027z"
        fill={theme?.app?.primaryColor1}
      />
    </Svg>
  );
}

export default SvgComponent;
