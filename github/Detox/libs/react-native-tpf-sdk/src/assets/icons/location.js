import * as React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={23}
      height={33}
      viewBox="0 0 23 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.802 1.539a11.318 11.318 0 0111.557.095C20.88 3.823 23.02 7.728 23 11.93c-.081 4.173-2.376 8.096-5.244 11.13a30.762 30.762 0 01-5.517 4.632c-.208.12-.434.2-.67.237a1.347 1.347 0 01-.642-.195 30.42 30.42 0 01-7.949-7.47A15.245 15.245 0 010 11.72C-.002 7.51 2.213 3.625 5.802 1.539zm2.074 11.924a3.906 3.906 0 003.61 2.46 3.843 3.843 0 002.766-1.153 3.989 3.989 0 001.14-2.813c.006-1.61-.942-3.065-2.401-3.685a3.854 3.854 0 00-4.262.853 4.033 4.033 0 00-.853 4.338z"
        fill="#EA4336"
      />
      <Ellipse opacity={0.4} cx={11.5001} cy={31.2145} rx={8.21433} ry={1.64287} fill="#EA4336" />
    </Svg>
  );
}

export default SvgComponent;
