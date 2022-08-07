import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

const IconPaypalSVG = (props: SvgProps) => (
  <Svg width={36} height={24} fill="none" {...props}>
    <G>
      <Path
        d="M27.087 5.98a3.044 3.044 0 0 0-3.115-.666.857.857 0 0 0-.576.686l-.24 1.649a5.086 5.086 0 0 1-5.013 4.35h-3.428a.857.857 0 0 0-.832.65l-2.571 10.286A.857.857 0 0 0 12.143 24h4.286a.857.857 0 0 0 .831-.65l1.552-6.207h3.343a5.56 5.56 0 0 0 5.417-4.233l.632-2.535a4.508 4.508 0 0 0-1.117-4.396Z"
        fill="#469BDB"
      />
      <Path
        d="M24.256 1.483A4.332 4.332 0 0 0 20.99 0h-9.703a.857.857 0 0 0-.844.705L7.014 19.562a.857.857 0 0 0 .843 1.01H13a.857.857 0 0 0 .832-.65l1.553-6.208h2.758a6.81 6.81 0 0 0 6.712-5.828l.428-2.93a4.366 4.366 0 0 0-1.027-3.473Z"
        fill="#283B82"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h36v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default IconPaypalSVG;
