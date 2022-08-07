import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const WaitingPaymentSVG = () => (
  <Svg width={20} height={20} fill="none">
    <Path
      d="M17.166 9.167v-.5H2.833v7.666h14.334V9.167ZM16.666 8h.5V3.667H2.833V8h13.834ZM2.5 3h15a.333.333 0 0 1 .333.333v13.334A.333.333 0 0 1 17.5 17h-15a.333.333 0 0 1-.333-.333V3.333A.333.333 0 0 1 2.5 3Zm9.666 10H14.5v.667h-2.334V13Z"
      fill="#101920"
      stroke="#fff"
    />
  </Svg>
);

export default WaitingPaymentSVG;
