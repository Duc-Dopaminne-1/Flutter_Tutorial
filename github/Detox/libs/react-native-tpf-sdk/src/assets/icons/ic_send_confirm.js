import * as React from 'react';
import Svg, { Path, Rect, Circle, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={84}
      height={88}
      viewBox="0 0 84 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M53.29 24.793a4.857 4.857 0 01-4.852-4.851V4H23.623C19.42 4 16 7.42 16 11.624V67.35c0 4.204 3.42 7.624 7.624 7.624h29.857a14.93 14.93 0 01-2.31-8c0-8.284 6.717-15 15-15 1.346 0 2.65.178 3.891.51v-27.69H53.29zm-25.923 29.11h10.08a2.08 2.08 0 010 4.16h-10.08a2.08 2.08 0 010-4.16zm-2.08-9.01c0-1.148.932-2.079 2.08-2.079h30.497a2.08 2.08 0 010 4.159H27.367a2.08 2.08 0 01-2.08-2.08zm32.577-13.169a2.08 2.08 0 010 4.159H27.367a2.08 2.08 0 010-4.159h30.497zm-5.268-11.783c0 .382.311.693.693.693h15.847a7.606 7.606 0 00-1.458-1.903L54.312 6.085a7.644 7.644 0 00-1.716-1.223v15.08z"
        fill="url(#prefix__paint0_linear)"
      />
      <Path
        d="M66 54.813A12.187 12.187 0 1078.188 67 12.201 12.201 0 0066 54.812zm5.804 10.053l-6.875 6.562a.94.94 0 01-1.297 0l-3.436-3.28a.938.938 0 011.296-1.358l2.789 2.664 6.227-5.945a.939.939 0 011.296 1.357z"
        fill="#00B495"
      />
      <Rect
        x={73.142}
        y={1.733}
        width={2.616}
        height={10.465}
        rx={1.308}
        transform="rotate(26.198 73.142 1.733)"
        fill="#00B495"
      />
      <Rect
        x={66.733}
        y={5.869}
        width={2.616}
        height={10.465}
        rx={1.308}
        transform="rotate(-63.802 66.733 5.869)"
        fill="#00B495"
      />
      <Rect
        x={8.224}
        y={65.325}
        width={2}
        height={8}
        rx={1}
        transform="rotate(26.198 8.224 65.325)"
        fill="#00B495"
      />
      <Rect
        x={3.324}
        y={68.486}
        width={2}
        height={8}
        rx={1}
        transform="rotate(-63.802 3.324 68.486)"
        fill="#00B495"
      />
      <Circle cx={82.5} cy={19.5} r={1.5} fill="#00B495" />
      <Circle cx={1} cy={60} r={1} fill="#00B495" />
      <Ellipse opacity={0.1} cx={45.5} cy={83.5} rx={30.5} ry={4.5} fill="#00B495" />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={43.031}
          y1={74.987}
          x2={43.031}
          y2={3.987}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#00B495" />
          <Stop offset={1} stopColor="#FFB546" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
