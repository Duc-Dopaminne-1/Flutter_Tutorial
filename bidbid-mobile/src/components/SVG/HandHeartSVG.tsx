import * as React from 'react';
import Svg, { Mask, G, Path, Defs, ClipPath } from 'react-native-svg';

const HandHeartSVG = () => (
  <Svg width={24} height={24} fill="none">
    <Mask id="a">
      <Path d="M0 0h24v24H0V0Z" fill="#C4C4C4" />
    </Mask>
    <G clipPath="url(#b)" fill="#575E62">
      <Path d="M3.953 13.215a.39.39 0 1 0 0 .781.39.39 0 0 0 0-.781Z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.413 13.605a.54.54 0 1 1 1.081 0 .54.54 0 0 1-1.081 0Zm.15 0a.39.39 0 1 1 .781 0 .39.39 0 0 1-.781 0Z"
      />
      <Path d="m19.954 14.57-3.683 1.265a1.564 1.564 0 0 0-1.537-1.84h-2.53a.39.39 0 0 1-.191-.05l-2.064-1.16a2.736 2.736 0 0 0-1.34-.352h-2.77a1.174 1.174 0 0 0-1.105-.78H2.391a.39.39 0 0 0-.391.39v7.031c0 .216.175.39.39.39h2.344c.498 0 .925-.312 1.094-.751.442.055.954.185 1.275.378l2.043 1.226a4.98 4.98 0 0 0 4.623.264l7.29-3.21a1.515 1.515 0 0 0 .745-2.15c-.34-.629-1.134-.909-1.85-.652ZM5.125 18.293a.391.391 0 0 1-.39.39H2.78v-6.25h1.953c.216 0 .391.175.391.39v5.47Zm15.638-1.646-.012.005-7.303 3.216a4.198 4.198 0 0 1-3.9-.222l-2.043-1.225c-.437-.263-1.063-.423-1.599-.487v-4.72h2.702c.335 0 .666.086.958.25l2.064 1.162c.175.098.373.15.575.15h2.53a.782.782 0 0 1 0 1.563h-3.972a.39.39 0 1 0 0 .78h3.971c.256 0 .509-.063.732-.182l4.75-1.633c.35-.126.746 0 .901.287.233.43.04.898-.354 1.056Z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.013 13.946a.39.39 0 0 0 .192.05h2.53a1.564 1.564 0 0 1 1.536 1.84l3.683-1.267c.716-.257 1.511.023 1.85.651a1.515 1.515 0 0 1-.744 2.15l-7.29 3.211a4.98 4.98 0 0 1-4.623-.264l-2.044-1.226c-.321-.192-.833-.323-1.275-.378-.17.439-.596.752-1.094.752H2.391a.39.39 0 0 1-.39-.39v-7.032a.39.39 0 0 1 .39-.39h2.343c.51 0 .944.326 1.105.78h2.77c.468 0 .932.122 1.34.352l2.064 1.16Zm-1.99-1.292 2.063 1.161c.036.02.077.03.119.03h2.53a1.714 1.714 0 0 1 1.71 1.772l3.458-1.189c.779-.279 1.655.022 2.034.721a1.665 1.665 0 0 1-.819 2.36l-7.287 3.209a5.13 5.13 0 0 1-4.762-.272m0 0L7.026 19.22c-.27-.162-.702-.283-1.106-.343a1.323 1.323 0 0 1-1.186.738H2.391a.54.54 0 0 1-.54-.54v-7.032a.54.54 0 0 1 .54-.54h2.343c.537 0 1 .32 1.206.78h2.668c.495 0 .984.129 1.415.371m10.671 3.86.005-.002h.002a.138.138 0 0 1 .008-.004c.31-.124.466-.493.276-.845-.113-.209-.423-.323-.718-.217l-.003.002-.305.104-4.433 1.524a1.71 1.71 0 0 1-.792.195h-3.97a.54.54 0 1 1 0-1.081h3.97a.632.632 0 0 0 0-1.263h-2.53c-.226 0-.45-.059-.648-.17l-2.063-1.16a1.804 1.804 0 0 0-.885-.232H6.056v4.439c.516.075 1.1.234 1.526.489l2.044 1.226a4.048 4.048 0 0 0 3.76.213l7.304-3.216.06.137-7.302 3.216a4.198 4.198 0 0 1-3.9-.222l-2.043-1.225c-.437-.263-1.063-.423-1.599-.487v-4.72h2.702c.335 0 .666.087.958.25l2.064 1.162c.175.098.374.15.575.15h2.53a.782.782 0 0 1 0 1.563h-3.972a.39.39 0 1 0 0 .78h3.971c.257 0 .509-.063.733-.182l4.75-1.633c.35-.126.745 0 .9.287.233.43.04.898-.354 1.056l-.012.005-.061-.137.004-.002Zm-15.96 2.02c.133 0 .24-.108.241-.24v-5.47a.241.241 0 0 0-.24-.24H2.93v5.95h1.803Zm.391-.24a.391.391 0 0 1-.39.39H2.78v-6.25h1.953c.216 0 .391.175.391.39v5.47Z"
      />
      <Path d="M16.25 3.5c1.519 0 2.75 1.25 2.75 3 0 3.5-3.75 5.5-5 6.25C12.75 12 9 10 9 6.5c0-1.75 1.25-3 2.75-3 .93 0 1.75.5 2.25 1 .5-.5 1.32-1 2.25-1Zm-1.783 7.802c.44-.278.838-.554 1.21-.85C17.167 9.266 18 7.971 18 6.5c0-1.18-.768-2-1.75-2-.538 0-1.12.285-1.543.707L14 5.914l-.707-.707c-.423-.422-1.005-.707-1.543-.707-.97 0-1.75.828-1.75 2 0 1.472.833 2.767 2.322 3.951.373.296.77.573 1.211.85.15.095.298.185.467.287.17-.101.318-.192.467-.286Z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m14 12.925-.077-.046c-.07-.043-.15-.09-.235-.14-.67-.395-1.777-1.048-2.76-1.974C9.82 9.72 8.85 8.308 8.85 6.5c0-1.824 1.309-3.15 2.9-3.15.918 0 1.726.46 2.25.942.525-.483 1.332-.942 2.25-.942 1.611 0 2.9 1.327 2.9 3.15 0 1.808-.97 3.22-2.078 4.265-.982.926-2.09 1.579-2.76 1.974l-.235.14-.077.046Zm0-8.426V4.5c-.5-.5-1.32-1-2.25-1-1.5 0-2.75 1.25-2.75 3 0 3.3 3.335 5.267 4.763 6.11l.237.14c.071-.043.15-.09.237-.14C15.665 11.767 19 9.8 19 6.5c0-1.75-1.23-3-2.75-3-.93 0-1.75.5-2.25 1Zm1.584 5.835c1.472-1.17 2.266-2.427 2.266-3.834 0-1.114-.717-1.85-1.6-1.85-.489 0-1.035.262-1.437.663L14 6.126l-.813-.813c-.402-.401-.948-.663-1.437-.663-.872 0-1.6.745-1.6 1.85 0 1.408.795 2.664 2.266 3.834.367.292.76.565 1.197.84.125.08.25.156.387.239.137-.083.262-.16.387-.238.437-.276.83-.55 1.197-.84Zm-1.117.968c-.15.094-.297.184-.467.286-.17-.101-.317-.192-.467-.286-.44-.278-.838-.554-1.21-.85C10.833 9.265 10 7.971 10 6.5c0-1.172.78-2 1.75-2 .538 0 1.12.285 1.543.707l.707.707.707-.707c.423-.422 1.005-.707 1.543-.707.982 0 1.75.82 1.75 2 0 1.471-.832 2.766-2.323 3.951-.372.296-.77.573-1.21.851Z"
      />
    </G>
    <Defs>
      <ClipPath id="b">
        <Path fill="#fff" transform="translate(2 2)" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default HandHeartSVG;