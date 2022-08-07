import * as React from 'react';
import Svg, { SvgProps, Rect, Mask, Path, G, Defs, ClipPath } from 'react-native-svg';

const CareerStrengthsSVG = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Rect width={28} height={28} rx={14} fill="#CFD1D2" />
    <Mask id="a" x={5} y={5} width={18} height={18}>
      <Path fill="#C4C4C4" d="M5 5h18v18H5z" />
    </Mask>
    <G clipPath="url(#b)" fill="#fff">
      <Path d="M11.363 21.5h6.153v-6.517l.879-1.758V7.379h-1.758V6.5h-6.153v3.545h-.879v3.258l1.758 1.758V21.5Zm5.274-.879h-4.395v-3.545h4.395v3.545Zm.879-12.363v1.787h-.88V8.258h.88Zm-1.758-.88v2.667h-.88V7.379h.88Zm-1.758 0v2.667h-.879V7.379H14Zm-2.637 0h.88v2.667h-.88V7.379Zm-.879 5.561v-2.015h3.44a1.32 1.32 0 0 1-1.242.879h-1.319v.879h1.758a.88.88 0 0 1 .879.878h.879c0-.59-.293-1.113-.741-1.432.35-.31.6-.73.697-1.204h2.68v2.093l-.878 1.758v1.422h-4.395v-1.5l-1.758-1.758ZM6.508 11.142l1.885-.601.267.837-1.885.602-.267-.838ZM19.345 8.713l1.885-.6.267.837-1.885.601-.267-.838ZM6.508 8.95l.267-.838 1.885.6-.267.838-1.885-.6ZM19.342 11.373l.268-.838 1.884.601-.267.838-1.885-.601Z" />
    </G>
    <Defs>
      <ClipPath id="b">
        <Path fill="#fff" transform="translate(6.5 6.5)" d="M0 0h15v15H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default CareerStrengthsSVG;
