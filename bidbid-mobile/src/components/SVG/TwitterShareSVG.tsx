import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const TwitterShareSVG = () => (
  <Svg width={30} height={24} fill="none">
    <G clipPath="url(#a)">
      <Path
        d="M30 2.78a12.144 12.144 0 0 1-3.443.942 5.983 5.983 0 0 0 2.636-3.29 12.023 12.023 0 0 1-3.806 1.44A5.981 5.981 0 0 0 21.021 0c-3.308 0-5.99 2.658-5.99 5.935 0 .464.055.916.157 1.354A17.067 17.067 0 0 1 2.845 1.083a5.863 5.863 0 0 0-.811 2.989 5.923 5.923 0 0 0 2.663 4.943 6.098 6.098 0 0 1-2.715-.741v.07c0 2.878 2.065 5.276 4.802 5.822-.5.137-1.029.213-1.574.213a6.37 6.37 0 0 1-1.128-.11 6 6 0 0 0 5.593 4.124A12.101 12.101 0 0 1 .809 20.85a17.115 17.115 0 0 0 9.181 2.663c11.015 0 17.041-9.045 17.041-16.892 0-.257-.008-.513-.02-.766A11.784 11.784 0 0 0 30 2.78Z"
        fill="#03A9F4"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h30v23.514H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default TwitterShareSVG;
