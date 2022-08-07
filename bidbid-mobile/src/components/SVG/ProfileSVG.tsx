import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const ProfileSVG = () => (
  <Svg width={14} height={17} fill="none">
    <Circle cx={6.834} cy={4.459} stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" r={3.584} />
    <Path
      clipRule="evenodd"
      d="M1 13.026c-.001-.252.055-.5.165-.727.343-.687 1.311-1.05 2.114-1.216.58-.123 1.167-.206 1.758-.247a18.79 18.79 0 0 1 3.288 0c.59.042 1.178.124 1.757.247.804.165 1.772.495 2.115 1.216.22.462.22 1 0 1.462-.343.72-1.311 1.05-2.115 1.208-.578.129-1.166.214-1.757.254-.89.075-1.785.09-2.677.041-.206 0-.405 0-.611-.041-.59-.04-1.175-.125-1.751-.254-.81-.158-1.771-.487-2.121-1.208A1.71 1.71 0 0 1 1 13.026Z"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ProfileSVG;
