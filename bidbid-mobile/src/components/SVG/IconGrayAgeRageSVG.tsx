import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';

const IconGrayAgeRageSVG = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Rect width={28} height={28} rx={14} fill="#CFD1D2" />
    <Path
      d="M17.015 13.185a2.473 2.473 0 1 0 0-4.945M18.152 15.873c.408.027.813.086 1.213.174.554.11 1.222.338 1.459.835.151.319.151.69 0 1.009-.237.497-.905.724-1.46.838"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      clipRule="evenodd"
      d="M12.194 16.405c2.767 0 5.131.419 5.131 2.094 0 1.675-2.349 2.109-5.131 2.109-2.768 0-5.131-.419-5.131-2.094 0-1.676 2.348-2.11 5.13-2.11ZM12.194 14.014a3.276 3.276 0 0 1-3.288-3.288 3.276 3.276 0 0 1 3.287-3.289 3.277 3.277 0 0 1 3.29 3.288 3.277 3.277 0 0 1-3.29 3.29Z"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IconGrayAgeRageSVG;
