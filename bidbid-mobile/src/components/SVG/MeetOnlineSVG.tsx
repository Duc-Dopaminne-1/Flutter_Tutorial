import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const MeetOnlineSVG = (props: SvgProps) => (
  <Svg width={12} height={10} fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 2A1.5 1.5 0 0 1 1.5.5h6A1.5 1.5 0 0 1 9 2v.806l2.342-.78A.5.5 0 0 1 12 2.5v5.25a.5.5 0 0 1-.692.462L9 7.25V8a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 0 8V2Zm9 4.167L11 7V3.194L9 3.86v2.307ZM1.5 1.5A.5.5 0 0 0 1 2v6a.5.5 0 0 0 .5.5h6A.5.5 0 0 0 8 8V2a.5.5 0 0 0-.5-.5h-6Z"
      fill="#F9423A"
    />
  </Svg>
);

export default MeetOnlineSVG;
