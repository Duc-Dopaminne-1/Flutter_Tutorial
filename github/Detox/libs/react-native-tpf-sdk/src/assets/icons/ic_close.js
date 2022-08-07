import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import themeContext from '../../constants/theme/themeContext';
import { TEXT_COLOR } from '../../constants/colors';

function ICClose(props, svgRef) {
  const theme = React.useContext(themeContext);
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      {...props}>
      <Path
        d="M13.59 12l4.454-4.453a1.126 1.126 0 00-1.59-1.593L12 10.407 7.547 5.954a1.127 1.127 0 00-1.594 1.593l4.453 4.454-4.453 4.453a1.127 1.127 0 001.594 1.593L12 13.594l4.453 4.453a1.127 1.127 0 001.594-1.593L13.59 12z"
        fill={props?.color1 ?? (theme?.app?.primaryColor1 || TEXT_COLOR.Orange)}
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(ICClose);
export default ForwardRef;
