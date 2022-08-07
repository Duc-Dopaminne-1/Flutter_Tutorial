import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const ChatHistorySVG = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <Path
      d="M3.385 6H5.5v1h-5V2h1v3.499L2.4 4.3A9.5 9.5 0 0 1 19.5 10a9.5 9.5 0 0 1-9.5 9.5c-5.08 0-9.227-3.986-9.487-9h1.001a8.5 8.5 0 1 0 1.458-5.281L2.44 6h.945ZM9.5 10.206V5.5h1v4.292l.146.147 2.89 2.889-.708.708-3.328-3.33Z"
      fill="#000"
      stroke="#575E62"
    />
  </Svg>
);

export default ChatHistorySVG;
