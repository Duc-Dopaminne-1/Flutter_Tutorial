import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const AccountSVG = () => (
  <Svg width={20} height={20} fill="none">
    <Circle cx={8.834} cy={5.459} stroke="#6F7579" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" r={3.584} />
    <Path
      clipRule="evenodd"
      d="M3 14.026c-.001-.252.055-.501.165-.728.343-.687 1.311-1.05 2.114-1.215.58-.124 1.167-.206 1.758-.247a18.79 18.79 0 0 1 3.288 0c.59.041 1.178.124 1.757.247.804.165 1.772.494 2.115 1.215.22.463.22 1 0 1.462-.343.721-1.311 1.05-2.115 1.209-.578.128-1.166.213-1.757.254-.89.075-1.785.089-2.677.04-.206 0-.405 0-.611-.04-.59-.04-1.175-.125-1.75-.254-.811-.158-1.772-.488-2.122-1.209A1.71 1.71 0 0 1 3 14.026Z"
      stroke="#6F7579"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default AccountSVG;
