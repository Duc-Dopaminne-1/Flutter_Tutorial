import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SettingProfileSVG = () => (
  <Svg width={18} height={18} fill="none">
    <Path
      d="M6.515 3 8.47 1.045a.75.75 0 0 1 1.06 0L11.486 3h2.764a.75.75 0 0 1 .75.75v2.765l1.955 1.955a.75.75 0 0 1 0 1.06L15 11.486v2.764a.75.75 0 0 1-.75.75h-2.764L9.53 16.955a.75.75 0 0 1-1.06 0L6.515 15H3.75a.75.75 0 0 1-.75-.75v-2.764L1.045 9.53a.75.75 0 0 1 0-1.06L3 6.515V3.75A.75.75 0 0 1 3.75 3h2.765ZM4.5 4.5v2.636L2.636 9 4.5 10.864V13.5h2.636L9 15.364l1.864-1.864H13.5v-2.636L15.364 9 13.5 7.136V4.5h-2.636L9 2.636 7.136 4.5H4.5ZM9 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      fill="#fff"
    />
  </Svg>
);

export default SettingProfileSVG;
