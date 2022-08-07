import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M7 .334a6.667 6.667 0 106.667 6.667A6.674 6.674 0 007.001.334zm0 10.77a.77.77 0 110-1.54.77.77 0 010 1.54zm1.814-3.316c-.355.357-.807.6-1.3.7v.051a.513.513 0 11-1.026 0v-.513A.512.512 0 017 7.513a1.538 1.538 0 001.087-2.626c-.58-.582-1.595-.582-2.175 0a1.524 1.524 0 00-.45 1.088.513.513 0 11-1.026 0 2.547 2.547 0 01.75-1.813c.968-.968 2.659-.968 3.627 0a2.564 2.564 0 010 3.626z"
        fill="#367C4D"
      />
    </Svg>
  );
}

export default SvgComponent;
