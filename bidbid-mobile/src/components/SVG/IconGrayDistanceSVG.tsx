import * as React from 'react';
import Svg, { SvgProps, Rect, Path, Circle } from 'react-native-svg';

const IconGrayDistanceSVG = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Rect width={28} height={28} rx={14} fill="#CFD1D2" />
    <Path
      d="M13.342 10.25a3.84 3.84 0 0 1 7.586.852v.044c-.026 1.378-.796 2.652-1.739 3.647-.54.56-1.142 1.057-1.796 1.479a.465.465 0 0 1-.608 0 9.903 9.903 0 0 1-.777-.561"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={17.089} cy={11.15} stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" r={1.23} />
    <Path
      clipRule="evenodd"
      d="M7.25 14.826a3.84 3.84 0 1 1 7.678.026v.044c-.026 1.378-.795 2.652-1.739 3.648a10.09 10.09 0 0 1-1.796 1.478.465.465 0 0 1-.608 0 9.91 9.91 0 0 1-2.526-2.365 4.913 4.913 0 0 1-1.009-2.818v-.013Z"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={11.089} cy={14.9} r={1.23} stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default IconGrayDistanceSVG;
