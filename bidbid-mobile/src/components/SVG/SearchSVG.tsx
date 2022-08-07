import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const SearchSVG = (props: SvgProps) => (
  <Svg width={14} height={14} fill="none" {...props}>
    <Path
      d="M13.504 12.718 9.712 8.927a5.252 5.252 0 0 0 1.177-3.316A5.284 5.284 0 0 0 5.61.333 5.284 5.284 0 0 0 .333 5.611a5.284 5.284 0 0 0 5.278 5.278 5.252 5.252 0 0 0 3.316-1.177l3.791 3.792a.554.554 0 1 0 .786-.786ZM5.61 9.778A4.171 4.171 0 0 1 1.444 5.61a4.171 4.171 0 0 1 4.167-4.167 4.171 4.171 0 0 1 4.167 4.167A4.171 4.171 0 0 1 5.61 9.778Z"
      fill="#6F7579"
    />
  </Svg>
);

export default SearchSVG;
