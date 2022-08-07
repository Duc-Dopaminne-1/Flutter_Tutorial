import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const ProfileTabarSVG = () => (
  <Svg width={24} height={24} fill="none">
    <Circle cx={11.778} cy={7.278} r={4.778} stroke="#ABB0BB" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path
      clipRule="evenodd"
      d="M4 18.702a2.215 2.215 0 0 1 .22-.97c.457-.916 1.748-1.401 2.819-1.62a16.778 16.778 0 0 1 2.343-.33 25.059 25.059 0 0 1 4.385 0c.787.055 1.57.165 2.343.33 1.07.219 2.361.658 2.82 1.62a2.27 2.27 0 0 1 0 1.949c-.459.961-1.75 1.4-2.82 1.61a15.71 15.71 0 0 1-2.343.34c-1.188.1-2.38.119-3.57.055-.275 0-.54 0-.815-.055a15.417 15.417 0 0 1-2.334-.34c-1.08-.21-2.361-.649-2.828-1.61a2.28 2.28 0 0 1-.22-.98Z"
      stroke="#ABB0BB"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default ProfileTabarSVG;
