import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SafetySVG = () => (
  <Svg width={18} height={18} fill="none">
    <Path
      d="m9 .75 6.163 1.37a.75.75 0 0 1 .587.732v7.49a4.5 4.5 0 0 1-2.004 3.744L9 17.25l-4.746-3.164a4.498 4.498 0 0 1-2.004-3.744v-7.49a.75.75 0 0 1 .587-.732L9 .75Zm0 1.537L3.75 3.453v6.889a3 3 0 0 0 1.336 2.496L9 15.448l3.914-2.61a2.999 2.999 0 0 0 1.336-2.495v-6.89L9 2.288v-.001Zm3.339 3.88 1.061 1.06L8.627 12 5.445 8.818l1.06-1.06 2.122 2.12 3.712-3.712Z"
      fill="#fff"
    />
  </Svg>
);

export default SafetySVG;
