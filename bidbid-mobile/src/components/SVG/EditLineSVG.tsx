import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const EditLineSVG = () => (
  <Svg width={24} height={24} fill="none">
    <Path
      d="M5 19h1.414l9.314-9.314-1.414-1.414L5 17.586V19Zm16 2H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.83a1 1 0 0 1 0 1.413L9.243 19H21v2ZM15.728 6.858l1.414 1.414 1.414-1.414-1.414-1.414-1.414 1.414Z"
      fill="#2C93DD"
    />
  </Svg>
);

export default EditLineSVG;
