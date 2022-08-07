import * as React from 'react';
import Svg, { Mask, Path, G } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={56}
      height={56}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Mask
        id="a"
        style={{
          maskType: 'alpha'
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={56}
        height={56}>
        <Path fill="#C4C4C4" d="M0 0H56V56H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M28 5a23 23 0 1023 23A23.027 23.027 0 0028 5zm0 10.615a2.654 2.654 0 110 5.308 2.654 2.654 0 010-5.308zm1.77 24.77H28a1.768 1.768 0 01-1.77-1.77V28a1.77 1.77 0 110-3.538H28a1.77 1.77 0 011.77 1.769v10.615a1.77 1.77 0 110 3.539z"
          fill="#FFC600"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
