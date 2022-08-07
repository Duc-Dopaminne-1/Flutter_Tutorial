import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const BidLineSVG = () => (
  <Svg width={14} height={15} fill="none">
    <Circle cx={6.258} cy={6.69} r={5.175} stroke="#6F7579" />
    <Path d="m10.273 11.933 1.178-1.208 1.362 1.328a.844.844 0 1 1-1.178 1.208l-1.362-1.328Z" stroke="#6F7579" />
    <Path
      d="M6.58 9.55v-.41c.919-.078 1.448-.558 1.448-1.325 0-.649-.37-1.047-1.156-1.238l-.291-.066v-1.35c.413.05.695.32.708.664h.655c-.019-.699-.552-1.194-1.363-1.266v-.432h-.43v.432c-.845.079-1.36.558-1.36 1.282 0 .61.383 1.03 1.082 1.21l.279.071v1.429c-.467-.053-.768-.313-.8-.686h-.664c.004.727.568 1.219 1.464 1.278v.407h.429Zm.781-1.663c0 .398-.285.642-.78.67V7.204c.533.106.78.322.78.683ZM5.462 5.784c0-.341.289-.604.69-.626V6.42c-.452-.09-.69-.313-.69-.636Z"
      fill="#6F7579"
    />
  </Svg>
);

export default BidLineSVG;
