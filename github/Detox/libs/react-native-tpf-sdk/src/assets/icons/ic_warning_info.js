import * as React from 'react';
import Svg, { Mask, Path, G, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={88}
      height={88}
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Mask id="prefix__a" maskUnits="userSpaceOnUse" x={0} y={0} width={88} height={88}>
        <Path fill="#C4C4C4" d="M0 0h88v88H0z" />
      </Mask>
      <G mask="url(#prefix__a)" fill="#00B495">
        <Path d="M8 69a1.5 1.5 0 01-1.5-1.5V66a1.5 1.5 0 013 0v1.5A1.5 1.5 0 018 69zM8 61.5A1.5 1.5 0 016.5 60v-1.5a1.5 1.5 0 013 0V60A1.5 1.5 0 018 61.5zM12.5 64.5H11a1.5 1.5 0 010-3h1.5a1.5 1.5 0 010 3zM5 64.5H3.5a1.5 1.5 0 010-3H5a1.5 1.5 0 010 3zM77 16a1.75 1.75 0 01-1.75-1.75V12.5a1.75 1.75 0 113.5 0v1.75A1.75 1.75 0 0177 16zM77 7.25a1.75 1.75 0 01-1.75-1.75V3.75a1.75 1.75 0 013.5 0V5.5A1.75 1.75 0 0177 7.25zM82.25 10.75H80.5a1.75 1.75 0 010-3.5h1.75a1.75 1.75 0 010 3.5zM73.5 10.75h-1.75a1.75 1.75 0 010-3.5h1.75a1.75 1.75 0 010 3.5zM62 6a2 2 0 100-4 2 2 0 000 4zM15 73a1 1 0 100-2 1 1 0 000 2z" />
        <Ellipse opacity={0.1} cx={45.499} cy={81.5} rx={30.5} ry={4.5} />
      </G>
      <Path
        d="M46 10.5A32.5 32.5 0 1078.5 43 32.538 32.538 0 0046 10.5zm0 15a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5zm2.5 35H46a2.5 2.5 0 01-2.5-2.5V43a2.5 2.5 0 110-5H46a2.498 2.498 0 012.5 2.5v15a2.5 2.5 0 010 5z"
        fill="url(#prefix__paint0_linear)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={46}
          y1={75.512}
          x2={46}
          y2={10.488}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#00B495" />
          <Stop offset={1} stopColor="#FFB546" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
