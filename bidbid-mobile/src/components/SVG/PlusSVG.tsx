import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlusSVG = () => (
  <Svg width={16} height={16} fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 0c.294 0 .533.326.533.727v14.546c0 .401-.239.727-.533.727-.295 0-.533-.326-.533-.727V.727C7.467.326 7.705 0 8 0Z"
      fill="#F9423A"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 8c0-.294.326-.533.727-.533h14.546c.401 0 .727.239.727.533 0 .295-.326.533-.727.533H.727C.326 8.533 0 8.295 0 8Z"
      fill="#F9423A"
    />
  </Svg>
);

export default PlusSVG;
