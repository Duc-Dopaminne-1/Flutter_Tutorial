import * as React from 'react';
import Svg, { SvgProps, Mask, Path, G } from 'react-native-svg';

const IconPaypalLogoSVG = (props: SvgProps) => (
  <Svg width={80} height={24} fill="none" {...props}>
    <Mask id="a" x={0} y={0} width={80} height={24}>
      <Path d="M80 0H0v24h80V0Z" fill="#C4C4C4" />
    </Mask>
    <G mask="url(#a)" fill="#fff">
      <Path d="M62.455 5.132c-1.964 0-3.535.523-4.845.785l-.393 3.012c.655-.262 2.488-.786 4.06-.917 1.57 0 2.487.262 2.225 1.702-4.714 0-7.856.917-8.51 4.06-.917 5.237 4.844 5.368 7.07 3.01l-.262 1.441h4.19l1.833-8.51c.655-3.536-2.488-4.714-5.368-4.583Zm.262 8.772c-.262 1.048-1.179 1.44-2.226 1.572-.917 0-1.703-.524-1.179-1.572.524-.785 1.702-.785 2.619-.785h1.047c-.13-.131-.261.393-.261.785Z" />
      <Path d="M57.217 8.93c.655-.263 2.488-.786 4.06-.917 1.57 0 2.487.262 2.225 1.702-4.713 0-7.856.916-8.51 4.059-.917 5.237 4.844 5.368 7.07 3.011l-.262 1.44h4.19l1.833-8.51c.786-3.535-2.488-4.452-5.368-4.452L57.217 8.93Zm5.5 4.975c-.262 1.047-1.179 1.44-2.226 1.57-.917 0-1.702-.523-1.179-1.57.524-.786 1.702-.786 2.619-.786h1.047c-.13-.13-.261.393-.261.786ZM71.358 1.204l-3.404 17.021h4.19l3.535-17.02h-4.32Z" />
      <Path d="m74.37 1.204-6.416 17.021h4.19l3.535-17.02h-4.32 3.01ZM51.85 1.204h-7.725l-3.404 17.021h4.582l1.179-5.237h3.273c3.142 0 5.761-1.833 6.416-5.106.654-3.797-2.095-6.678-4.321-6.678Zm-.13 5.892c-.263 1.178-1.441 1.964-2.62 1.964h-2.095l.917-3.928h2.226c1.178 0 1.833.786 1.571 1.964Z" />
      <Path d="M51.85 1.204h-5.238l-6.023 17.021h4.583l1.178-5.237h3.273c3.143 0 5.761-1.833 6.416-5.106.786-3.797-1.964-6.678-4.19-6.678Zm-.132 5.892c-.262 1.178-1.44 1.964-2.619 1.964h-2.094l.916-3.928h2.226c1.178 0 1.833.786 1.571 1.964ZM21.604 5.132c-1.964 0-3.535.523-4.714.785l-.392 3.012c.523-.262 2.487-.786 4.058-.917 1.572 0 2.488.262 2.226 1.702-4.582 0-7.725.917-8.38 4.06-.916 5.237 4.714 5.368 6.94 3.01l-.262 1.441h4.19l1.833-8.51c.655-3.536-2.619-4.714-5.499-4.583Zm.393 8.772c-.262 1.048-1.179 1.44-2.226 1.572-.917 0-1.702-.524-1.047-1.572.523-.785 1.702-.785 2.487-.785h1.048c-.131-.131-.262.393-.262.785Z" />
      <Path d="M16.628 8.93c.524-.263 2.488-.786 4.06-.917 1.57 0 2.487.262 2.225 1.702-4.582 0-7.725.916-8.38 4.059-.916 5.237 4.714 5.368 6.94 3.011l-.393 1.44h4.19l1.833-8.51c.786-3.535-2.488-4.452-5.368-4.452L16.628 8.93Zm5.369 4.975c-.262 1.047-1.179 1.44-2.226 1.57-.917 0-1.702-.523-1.048-1.57.524-.786 1.703-.786 2.488-.786h1.048c-.131-.13-.262.393-.262.786ZM28.805 5.132h4.19l.655 7.332 4.19-7.332h4.32l-9.95 18.33h-4.714l3.012-5.499-1.703-12.831Z" />
      <Path d="m32.995 5.394.655 7.201 4.19-7.463h4.32l-9.95 18.33h-4.714l3.012-5.368M11.26 1.204H3.404L0 18.225h4.583l1.178-5.237h3.273c3.143 0 5.761-1.833 6.416-5.106.786-3.797-1.964-6.678-4.19-6.678Zm-.13 5.892C10.866 8.274 9.688 9.06 8.51 9.06H6.417l.916-3.928h2.226c1.178 0 1.833.786 1.571 1.964Z" />
      <Path d="M11.26 1.204H7.725L0 18.225h4.583l1.178-5.237h3.273c3.143 0 5.761-1.833 6.416-5.106.786-3.797-1.964-6.678-4.19-6.678Zm-.13 5.892C10.866 8.274 9.688 9.06 8.51 9.06H6.417l.916-3.928h2.226c1.178 0 1.833.786 1.571 1.964ZM20.818 9.714c-3.535.262-5.892 1.31-6.415 3.928-.917 5.238 4.713 5.369 6.94 3.012l-.263 1.571h4.19l.655-3.142-5.107-5.369Zm1.179 4.19c-.262 1.048-1.179 1.44-2.226 1.571-.917 0-1.702-.523-1.047-1.57.523-.786 1.702-.786 2.487-.786h1.048c-.131-.131-.262.392-.262.785ZM33.911 12.333l-.262.393 2.75 2.619L42.16 5.132h-4.32l-3.929 7.201Z" />
      <Path d="m4.582 18.225 1.179-5.237-5.368 5.237h4.19ZM45.171 18.226l1.179-5.5v.131l-5.369 5.369h4.19ZM61.538 9.715c-3.535.262-5.892 1.31-6.416 3.928-.916 5.237 4.845 5.368 7.07 3.011l-.392 1.572h4.19l.654-3.143-5.106-5.368Zm1.179 4.19c-.262 1.047-1.179 1.44-2.226 1.57-.917 0-1.703-.523-1.179-1.57.524-.786 1.702-.786 2.619-.786h1.047c-.13-.13-.261.393-.261.786ZM70.966 10.5l-3.012 7.726h4.19l1.178-5.238-2.356-2.487ZM76.596 3.953V2.12h-.655v-.262h1.703v.262h-.655v1.833h-.393ZM77.905 3.953V1.858h.393l.524 1.44c0 .132.13.263.13.263 0-.131 0-.131.132-.393l.523-1.44H80v2.094h-.262V1.99l-.654 1.833h-.393l-.655-1.833v1.833h-.13v.131Z" />
    </G>
  </Svg>
);

export default IconPaypalLogoSVG;
