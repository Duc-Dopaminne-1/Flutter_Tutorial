import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const IconRedHeartSVG = (props: SvgProps) => (
  <Svg width={18} height={18} fill="none" {...props}>
    <Path
      d="M12.375 2.25c2.278 0 4.125 1.875 4.125 4.5C16.5 12 10.875 15 9 16.125 7.125 15 1.5 12 1.5 6.75c0-2.625 1.875-4.5 4.125-4.5C7.02 2.25 8.25 3 9 3.75c.75-.75 1.98-1.5 3.375-1.5ZM9.7 13.953c.661-.417 1.258-.832 1.816-1.276C13.75 10.9 15 8.957 15 6.75c0-1.77-1.153-3-2.625-3-.807 0-1.68.428-2.315 1.06L9 5.872l-1.06-1.06C7.304 4.178 6.431 3.75 5.624 3.75 4.17 3.75 3 4.992 3 6.75c0 2.208 1.25 4.15 3.484 5.927.559.444 1.155.859 1.816 1.275.224.142.446.278.7.43.254-.152.476-.288.7-.429Z"
      fill="#F9423A"
    />
  </Svg>
);

export default IconRedHeartSVG;