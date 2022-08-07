import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9.132 23.25a.86.86 0 01-.848-1.01v-.004L9.6 15H4.5a.75.75 0 01-.583-1.222l10.273-12.7a.865.865 0 011.538.643c0 .014-.004.027-.006.042L14.4 9h5.1a.75.75 0 01.583 1.222l-10.275 12.7a.864.864 0 01-.676.328z"
        fill="#fff"
      />
    </Svg>
  );
}

export default SvgComponent;
