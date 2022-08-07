import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const AuctionCloseSVG = () => (
  <Svg width={20} height={20} fill="none">
    <Path d="M15 5 5 15M5 5l10 10" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default AuctionCloseSVG;
