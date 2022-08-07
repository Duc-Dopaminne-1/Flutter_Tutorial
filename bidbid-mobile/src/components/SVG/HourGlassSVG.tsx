import * as React from 'react';
import Svg, { SvgProps, Mask, Path, G, Defs, ClipPath } from 'react-native-svg';

const HourGlassSVG = (props: SvgProps) => (
  <Svg width={14} height={15} fill="none" {...props}>
    <Mask id="a" x={0} y={0} width={14} height={15}>
      <Path fill="#C4C4C4" d="M0 .937h14v14H0z" />
    </Mask>
    <G clipPath="url(#b)">
      <Path
        d="M9.482 7.115c.549-.57 1.47-1.762 1.47-3.318v-.564h.94v-1.13H2.107v1.13h.941v.564c0 1.556.921 2.747 1.47 3.318.31.323.643.6.976.822-.333.22-.666.5-.976.821-.549.572-1.47 1.763-1.47 3.319v.564h-.94v1.13h9.784v-1.13h-.94v-.564c0-1.556-.921-2.747-1.47-3.319-.31-.322-.643-.6-.977-.821.334-.221.667-.5.977-.822ZM8.667 9.54c.432.45 1.155 1.376 1.155 2.537v.564H4.177v-.564c0-1.161.724-2.088 1.155-2.537.689-.716 1.39-1.039 1.668-1.039s.979.323 1.667 1.04ZM7 7.372c-.278 0-.979-.322-1.668-1.039-.431-.449-1.155-1.375-1.155-2.536v-.564h5.645v.564c0 1.16-.723 2.087-1.155 2.536-.688.717-1.39 1.04-1.667 1.04Z"
        fill="#fff"
      />
    </G>
    <Defs>
      <ClipPath id="b">
        <Path fill="#fff" transform="translate(1.167 2.104)" d="M0 0h11.667v11.667H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default HourGlassSVG;
