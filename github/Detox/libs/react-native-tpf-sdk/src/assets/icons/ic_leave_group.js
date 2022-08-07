import * as React from 'react';
import Svg, { Rect, Circle, Ellipse, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={84} height={88} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
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
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M44.005 4c-10 0-18.175 8.175-18.175 18.175s8.175 18.174 18.175 18.174 18.174-8.174 18.174-18.174S54.005 4 44.005 4zm31.19 50.873c-.476-1.19-1.11-2.302-1.825-3.333-3.65-5.397-9.285-8.969-15.635-9.842-.793-.079-1.666.08-2.301.556-3.334 2.46-7.302 3.73-11.429 3.73-4.127 0-8.095-1.27-11.429-3.73-.634-.476-1.508-.715-2.301-.556A22.427 22.427 0 0014.64 51.54a19.536 19.536 0 00-1.825 3.333c-.238.476-.16 1.032.079 1.508.635 1.111 1.428 2.222 2.143 3.175a30.167 30.167 0 003.65 4.127c1.112 1.11 2.381 2.142 3.651 3.174C28.608 71.54 36.148 74 43.927 74c2.359 0 4.696-.226 6.982-.672A15.974 15.974 0 0150 68c0-8.837 7.163-16 16-16 3.432 0 6.612 1.08 9.218 2.92a1.296 1.296 0 00-.023-.047z"
        fill="url(#prefix__paint0_linear)"
      />
      <Path
        d="M74.49 58.511c-4.683-4.681-12.297-4.681-16.98 0-4.68 4.681-4.68 12.298 0 16.98A11.971 11.971 0 0066 79a11.97 11.97 0 008.49-3.51c4.68-4.681 4.68-12.298 0-16.979zm-3.538 12.027a1 1 0 11-1.415 1.415L66 68.415l-3.535 3.536a1.001 1.001 0 01-1.415-1.414L64.586 67l-3.537-3.537a1 1 0 111.415-1.414L66 65.585l3.537-3.536a1 1 0 111.415 1.414L67.415 67l3.537 3.538z"
        fill="#EF413D"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={44}
          y1={74.013}
          x2={44}
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
