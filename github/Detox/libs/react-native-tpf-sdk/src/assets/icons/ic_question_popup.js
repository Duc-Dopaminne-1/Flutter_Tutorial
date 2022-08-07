import * as React from 'react';
import Svg, { Mask, Path, G, Circle, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';

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
      <G mask="url(#prefix__a)">
        <Circle cx={46} cy={43} r={32} fill="url(#prefix__paint0_linear)" />
        <Path
          d="M46.309 59a2.909 2.909 0 100-5.818 2.909 2.909 0 000 5.818zM46.31 27C41.175 27 37 31.176 37 36.31a2.327 2.327 0 104.654 0 4.66 4.66 0 014.655-4.656 4.66 4.66 0 014.655 4.655 4.66 4.66 0 01-4.655 4.655 2.327 2.327 0 00-2.327 2.327v5.818a2.327 2.327 0 104.654 0v-3.785c4.011-1.036 6.982-4.685 6.982-9.015 0-5.133-4.176-9.309-9.309-9.309z"
          fill="#fff"
        />
        <Path
          d="M8 69a1.5 1.5 0 01-1.5-1.5V66a1.5 1.5 0 013 0v1.5A1.5 1.5 0 018 69zM8 61.5A1.5 1.5 0 016.5 60v-1.5a1.5 1.5 0 013 0V60A1.5 1.5 0 018 61.5zM12.5 64.5H11a1.5 1.5 0 010-3h1.5a1.5 1.5 0 010 3zM5 64.5H3.5a1.5 1.5 0 010-3H5a1.5 1.5 0 010 3zM77 16a1.75 1.75 0 01-1.75-1.75V12.5a1.75 1.75 0 013.5 0v1.75A1.75 1.75 0 0177 16zM77 7.25a1.75 1.75 0 01-1.75-1.75V3.75a1.75 1.75 0 013.5 0V5.5A1.75 1.75 0 0177 7.25zM82.25 10.75H80.5a1.75 1.75 0 010-3.5h1.75a1.75 1.75 0 010 3.5zM73.5 10.75h-1.75a1.75 1.75 0 010-3.5h1.75a1.75 1.75 0 010 3.5zM62 6a2 2 0 100-4 2 2 0 000 4zM15 73a1 1 0 100-2 1 1 0 000 2z"
          fill="#00B495"
        />
        <Ellipse opacity={0.1} cx={45.5} cy={81.5} rx={30.5} ry={4.5} fill="#00B495" />
      </G>
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={46}
          y1={75.012}
          x2={46}
          y2={10.988}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#00B495" />
          <Stop offset={1} stopColor="#FFB546" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
