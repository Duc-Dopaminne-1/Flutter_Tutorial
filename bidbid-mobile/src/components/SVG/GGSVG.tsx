import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const GGSVG = (props: SvgProps) => (
  <Svg width={48} height={48} fill="none" {...props}>
    <Path d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24Z" fill="#F3F3F4" />
    <Path
      d="M24.524 21.794v4.599h7.192A8.076 8.076 0 1 1 24 15.923c2.085 0 3.978.797 5.411 2.094l3.375-3.613A12.965 12.965 0 0 0 24 10.988c-7.186 0-13.012 5.826-13.012 13.012 0 7.186 5.826 13.012 13.012 13.012 7.186 0 13.012-5.826 13.012-13.012 0-.753-.07-1.489-.193-2.206H24.524Z"
      fill="#4285F4"
    />
    <Path
      d="M24 15.924c2.084 0 3.978.796 5.411 2.093l3.375-3.613A12.964 12.964 0 0 0 24 10.988c-4.983 0-9.31 2.803-11.496 6.917l3.97 3.18c1.171-3.018 4.095-5.161 7.526-5.161Z"
      fill="#EA4335"
    />
    <Path
      d="M15.924 24c0-1.029.2-2.01.55-2.915l-3.97-3.18A12.952 12.952 0 0 0 10.988 24c0 2.213.554 4.296 1.529 6.12l3.947-3.234a8.042 8.042 0 0 1-.54-2.886Z"
      fill="#FBBC05"
    />
    <Path
      d="M28.491 30.708a8.031 8.031 0 0 1-4.49 1.368c-3.442 0-6.374-2.157-7.536-5.19l-3.947 3.235c2.19 4.1 6.51 6.89 11.483 6.89 3.23 0 6.182-1.179 8.457-3.127l-3.967-3.176Z"
      fill="#34A853"
    />
    <Path
      d="M37.012 24c0-.753-.07-1.489-.193-2.206H24.523v4.599h7.193a8.091 8.091 0 0 1-3.226 4.314l3.967 3.177A12.979 12.979 0 0 0 37.012 24Z"
      fill="#4285F4"
    />
  </Svg>
);

export default GGSVG;