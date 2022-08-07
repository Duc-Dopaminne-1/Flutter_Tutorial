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
        d="M14.945 3.75a7.514 7.514 0 015.305 5.305M14.169 6.649a4.508 4.508 0 013.183 3.182M8.67 11.701a7.908 7.908 0 003.66 3.645.743.743 0 00.735-.055l2.347-1.566a.75.75 0 01.711-.065l4.391 1.882a.748.748 0 01.45.778 4.501 4.501 0 01-4.464 3.93A12.75 12.75 0 013.75 7.5a4.5 4.5 0 013.93-4.464.748.748 0 01.778.45l1.884 4.394a.751.751 0 01-.062.707L8.72 10.97a.743.743 0 00-.05.731v0z"
        stroke="#636466"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
