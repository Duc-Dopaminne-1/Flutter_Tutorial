import * as React from 'react';
import Svg, { SvgProps, Circle } from 'react-native-svg';

const MessageDotSVG = (props: SvgProps) => (
  <Svg width={8} height={8} fill="none" {...props}>
    <Circle cx={4} cy={4} r={3.75} fill="#6F7579" stroke="#fff" strokeWidth={0.5} />
  </Svg>
);

export default MessageDotSVG;
