import { CUSTOM_COLOR } from '../../constants/colors';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { scale } from '../../utils/responsive';

function SvgComponent(props, svgRef) {
  const { color } = props;
  return (
    <Svg
      width={scale(6)}
      height={scale(10)}
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      {...props}>
      <Path
        d="M1.383.24l4.345 4.15c.012.01.023.022.034.033a.825.825 0 010 1.159L1.384 9.76a.803.803 0 01-1.146 0 .825.825 0 010-1.16l3.804-3.595L.238 1.399a.825.825 0 010-1.158.804.804 0 011.145-.002z"
        fill={color || CUSTOM_COLOR.MidGray}
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgComponent);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
