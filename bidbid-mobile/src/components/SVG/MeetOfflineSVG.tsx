import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const MeetOfflineSVG = (props: SvgProps) => (
  <Svg width={10} height={11} fill="none" {...props}>
    <Path
      d="m5 9.45 2.475-2.475a3.5 3.5 0 1 0-4.95 0L5 9.45Zm0 1.414L1.818 7.682a4.5 4.5 0 1 1 6.364 0L5 10.864ZM5 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 1a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
      fill="#FA6861"
    />
  </Svg>
);

export default MeetOfflineSVG;
