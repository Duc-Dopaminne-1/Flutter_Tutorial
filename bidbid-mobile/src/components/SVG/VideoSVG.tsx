import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const VideoSVG = (props: SvgProps) => (
  <Svg width={18} height={14} fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 2.5A2.25 2.25 0 0 1 2.25.25h9A2.25 2.25 0 0 1 13.5 2.5v1.21l3.513-1.172A.75.75 0 0 1 18 3.25v7.875a.75.75 0 0 1-1.038.692L13.5 10.375V11.5a2.25 2.25 0 0 1-2.25 2.25h-9A2.25 2.25 0 0 1 0 11.5v-9Zm13.5 6.25 3 1.25V4.29l-3 1v3.46Zm-11.25-7a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h9a.75.75 0 0 0 .75-.75v-9a.75.75 0 0 0-.75-.75h-9Z"
      fill="#6F7579"
    />
  </Svg>
);

export default VideoSVG;
