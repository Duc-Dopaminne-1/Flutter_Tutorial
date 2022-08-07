import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const NoteAuctionSVGL = () => (
  <Svg width={24} height={24} fill="none">
    <Path d="M5 15a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H5Z" fill="#575E62" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.266 4.802a1 1 0 0 1 .366-1.366l3.464-2a1 1 0 0 1 1.366.366L15.308 5H21a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h5.38l-.114-.198Zm10.078 5.456L16.464 7H21a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h6.535l3.613 6.258a2 2 0 0 0 .63.669l3.535 2.334a1 1 0 0 0 1.55-.895l-.255-4.228a2 2 0 0 0-.264-.88Zm-7.846-5.59 4.382 7.59 1.866 1.232-.134-2.232-4.382-7.59-1.732 1Z"
      fill="#575E62"
    />
  </Svg>
);

export default NoteAuctionSVGL;
