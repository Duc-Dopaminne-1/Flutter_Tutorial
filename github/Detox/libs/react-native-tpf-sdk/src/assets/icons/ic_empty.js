import * as React from 'react';
import Svg, { Mask, Path, G, Ellipse, Defs, ClipPath } from 'react-native-svg';

function SvgComponent(props, svgRef) {
  return (
    <Svg
      width={115}
      height={115}
      viewBox="0 0 115 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      {...props}>
      <Mask id="prefix__a" maskUnits="userSpaceOnUse" x={0} y={0} width={115} height={115}>
        <Path fill="#C4C4C4" d="M0 0h115v115H0z" />
      </Mask>
      <G mask="url(#prefix__a)">
        <G clipPath="url(#prefix__clip0)">
          <Path
            d="M58.001 33.873l-3.594 23.681L58.001 99l35.72-11.84V45.713l-35.72-11.841z"
            fill="#939598"
          />
          <Path d="M22.28 45.714v41.445L58 99V33.873l-35.72 11.84z" fill="#B1B3B6" />
          <Path
            d="M55.305 7h5.39v18h-5.39V7zM28.311 17.63l3.623-3.992 13.329 12.097-3.623 3.992L28.311 17.63zM70.968 26.192l12.65-12.804 3.835 3.789-12.65 12.804-3.835-3.79zM47.72 73.882L58 57.554l-35.72-11.84L12 62.041l35.72 11.84z"
            fill="#E6E7E8"
          />
          <Path d="M68.28 73.882L58 57.554l35.72-11.84L104 62.041l-35.72 11.84z" fill="#B1B3B6" />
        </G>
        <Ellipse opacity={0.1} cx={57.5} cy={96} rx={56.5} ry={12} fill="#939598" />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path fill="#fff" transform="translate(12 7)" d="M0 0h92v92H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgComponent);
export default ForwardRef;
