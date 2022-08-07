import * as React from 'react';
import Svg, { Mask, Path, G, Ellipse, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

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
        <Path
          d="M46 11c-17.645 0-32 14.356-32 32s14.355 32 32 32c17.644 0 32-14.356 32-32S63.643 11 46 11zm17.884 23.579l-20.45 20.29c-1.204 1.204-3.129 1.284-4.412.08l-10.827-9.864c-1.283-1.203-1.363-3.208-.24-4.491a3.173 3.173 0 014.49-.16l8.582 7.86 18.286-18.286a3.195 3.195 0 014.571 0 3.195 3.195 0 010 4.57z"
          fill="url(#prefix__paint0_linear)"
        />
        <Path
          d="M8 69a1.5 1.5 0 01-1.5-1.5V66a1.5 1.5 0 013 0v1.5A1.5 1.5 0 018 69zM8 61.5A1.5 1.5 0 016.5 60v-1.5a1.5 1.5 0 013 0V60A1.5 1.5 0 018 61.5zM12.5 64.5H11a1.5 1.5 0 010-3h1.5a1.5 1.5 0 010 3zM5 64.5H3.5a1.5 1.5 0 010-3H5a1.5 1.5 0 010 3zM77 16a1.75 1.75 0 01-1.75-1.75V12.5a1.75 1.75 0 013.5 0v1.75A1.75 1.75 0 0177 16zM77 7.25a1.75 1.75 0 01-1.75-1.75V3.75a1.75 1.75 0 013.5 0V5.5A1.75 1.75 0 0177 7.25zM82.25 10.75H80.5a1.75 1.75 0 010-3.5h1.75a1.75 1.75 0 010 3.5zM73.5 10.75h-1.75a1.75 1.75 0 010-3.5h1.75a1.75 1.75 0 010 3.5zM62 6a2 2 0 100-4 2 2 0 000 4zM15 73a1 1 0 100-2 1 1 0 000 2z"
          fill="#00B495"
        />
        <Ellipse opacity={0.1} cx={45.5} cy={81.5} rx={30.5} ry={4.5} fill="#00B495" />
        <Circle cx={46} cy={43} r={32} fill="url(#prefix__paint1_linear)" />
        <Path
          d="M72.465 67.089l-2.24-2.24a.833.833 0 10-1.179 1.178l3.419 1.062zm0 0l.707.707.707-.707 2.24-2.24a.833.833 0 111.18 1.178l-2.948 2.948 2.947 2.948a.833.833 0 11-1.179 1.179l.59-.59h0l.118-.117h0l-4.362-5.306zm8.489-5.896h0c-4.293-4.291-11.272-4.291-15.564 0h0c-4.29 4.292-4.29 11.272 0 15.564h0a10.976 10.976 0 007.782 3.218c2.816 0 5.635-1.072 7.781-3.218h0c4.292-4.292 4.292-11.272 0-15.564zm-4.127 4.363s0 0 0 0h0z"
          fill="#EF413D"
          stroke="#fff"
          strokeWidth={2}
        />
      </G>
      <Path
        d="M42.082 49.667C43 50.334 44.333 51 46 51c1.666 0 3-.666 3.917-1.333M52.665 39v2.667M39.335 39v2.667M46 39v5.333c0 .736-.597 1.334-1.333 1.334M60.667 35v-4a2.666 2.666 0 00-2.666-2.667h-4M38 28.333h-4A2.666 2.666 0 0031.334 31v4M54 57.667h4A2.666 2.666 0 0060.668 55v-4M31.334 51v4A2.666 2.666 0 0034 57.667h4"
        stroke="#fff"
        strokeWidth={2.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={45.999}
          y1={75.012}
          x2={45.999}
          y2={10.988}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#00B495" />
          <Stop offset={1} stopColor="#FFB546" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint1_linear"
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
