import * as React from 'react';
import Svg, { Mask, Path, G, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={120}
      height={120}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Mask id="prefix__a" maskUnits="userSpaceOnUse" x={0} y={0} width={120} height={120}>
        <Path fill="#C4C4C4" d="M0 0h120v120H0z" />
      </Mask>
      <G mask="url(#prefix__a)">
        <Path
          d="M64 15c-24.06 0-43.637 19.576-43.637 43.636 0 24.06 19.577 43.637 43.637 43.637s43.636-19.576 43.636-43.637C107.636 34.576 88.06 15 64 15zm24.388 32.153L60.5 74.823c-1.64 1.64-4.265 1.75-6.015.109L39.721 61.48c-1.75-1.64-1.86-4.375-.328-6.124 1.64-1.75 4.374-1.86 6.124-.22L57.22 65.855 82.154 40.92c1.75-1.75 4.484-1.75 6.234 0s1.75 4.484 0 6.234z"
          fill="url(#prefix__paint0_linear)"
        />
        <Path
          d="M12.182 94.09a2.046 2.046 0 01-2.045-2.045V90a2.046 2.046 0 014.09 0v2.045c0 1.13-.915 2.046-2.045 2.046zM12.182 83.864a2.046 2.046 0 01-2.045-2.046v-2.045a2.046 2.046 0 014.09 0v2.045c0 1.13-.915 2.046-2.045 2.046zM18.318 87.954h-2.045a2.046 2.046 0 010-4.09h2.045a2.046 2.046 0 010 4.09zM8.09 87.954H6.046a2.045 2.045 0 010-4.09h2.046a2.046 2.046 0 010 4.09zM106.273 21.818a2.386 2.386 0 01-2.386-2.386v-2.386a2.386 2.386 0 114.772 0v2.386a2.386 2.386 0 01-2.386 2.386zM106.273 9.886a2.386 2.386 0 01-2.386-2.386V5.114a2.386 2.386 0 114.772 0V7.5a2.386 2.386 0 01-2.386 2.386zM113.432 14.66h-2.386a2.387 2.387 0 110-4.774h2.386a2.386 2.386 0 010 4.773zM101.5 14.66h-2.386a2.386 2.386 0 010-4.774h2.386a2.387 2.387 0 110 4.773zM85.818 8.182a2.727 2.727 0 100-5.455 2.727 2.727 0 000 5.455zM21.727 99.546a1.364 1.364 0 100-2.728 1.364 1.364 0 000 2.728z"
          fill="#00B495"
        />
        <Ellipse opacity={0.1} cx={63.318} cy={111.136} rx={41.591} ry={6.136} fill="#00B495" />
      </G>
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={64}
          y1={102.289}
          x2={64}
          y2={14.984}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#00B495" />
          <Stop offset={1} stopColor="#FFB546" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
