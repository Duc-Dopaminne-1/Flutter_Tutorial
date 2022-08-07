import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ShareRedSVG = () => (
  <Svg width={14} height={14} fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.75 1.166c0-.322.26-.583.583-.583h3.5c.322 0 .583.261.583.583v3.5a.583.583 0 1 1-1.166 0V2.575L5.662 9.162a.583.583 0 1 1-.825-.825l6.588-6.587H9.333a.583.583 0 0 1-.583-.584Z"
      fill="#F9423A"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.333 2.916a.583.583 0 0 0-.583.584v8.166c0 .322.26.584.583.584H10.5a.583.583 0 0 0 .583-.584V7a.583.583 0 0 1 1.167 0v4.666a1.75 1.75 0 0 1-1.75 1.75H2.333a1.75 1.75 0 0 1-1.75-1.75V3.5c0-.967.784-1.75 1.75-1.75H7a.583.583 0 1 1 0 1.166H2.333Z"
      fill="#F9423A"
    />
  </Svg>
);

export default ShareRedSVG;
