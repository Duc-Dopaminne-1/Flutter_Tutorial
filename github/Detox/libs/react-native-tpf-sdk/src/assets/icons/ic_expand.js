import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props, svgRef) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      {...props}>
      <Path
        d="M20.177 11.873H3.824a.186.186 0 100 .373h16.353a.186.186 0 000-.373z"
        fill="#F48220"
        stroke="#F58220"
        strokeWidth={0.5}
      />
      <Path
        d="M12 10.387a.186.186 0 01-.186-.186v-5.87l-1.541 1.542a.186.186 0 11-.263-.263l1.858-1.858a.178.178 0 01.125-.055h.013c.047 0 .092.02.125.053l1.858 1.858a.186.186 0 11-.263.263l-1.54-1.54v5.866a.185.185 0 01-.114.176.186.186 0 01-.072.014zM12 13.731a.186.186 0 01.185.186v5.87l1.541-1.541a.186.186 0 11.263.263l-1.858 1.857a.185.185 0 01-.26 0l-1.858-1.857a.186.186 0 01.263-.264l1.541 1.541v-5.87a.186.186 0 01.182-.185z"
        fill="#265A37"
        stroke="#265A37"
        strokeWidth={0.4}
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgComponent);
export default ForwardRef;
