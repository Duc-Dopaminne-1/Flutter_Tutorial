import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

const SvgComponent = props => {
  const { color1, color2, background } = props;

  return (
    <Svg width={56} height={56} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Rect width={56} height={56} rx={12} fill={color2 || '#178C77'} />
      <Path
        d="M39.348 34.807h-.359a3.724 3.724 0 0 1-3.723-3.724v-.454h7.805v.454a3.724 3.724 0 0 1-3.723 3.724ZM17.012 34.807h-.359a3.724 3.724 0 0 1-3.723-3.724v-.454h7.805v.454a3.724 3.724 0 0 1-3.723 3.724Z"
        fill={color1 || '#FF951F'}
      />
      <Path d="M29.04 15.836h-2.08v23.927h2.08V15.836Z" fill="#fff" />
      <Path d="M29.04 15.836H28v23.927h1.04V15.836Z" fill="#fff" />
      <Path
        d="M35.214 41.877H20.785v-2.075a.95.95 0 0 1 .95-.95h12.528a.95.95 0 0 1 .95.95v2.075ZM28 16.244a1.89 1.89 0 1 0 0-3.781 1.89 1.89 0 0 0 0 3.781ZM38.285 21.994a5.147 5.147 0 0 1-3.738-1.592 2.95 2.95 0 0 0-2.111-.907h-8.691c-.934 0-1.801.376-2.442 1.059-.858.915-2.104 1.44-3.416 1.44H13.47a.369.369 0 0 1-.368-.369v-1.103c0-.204.165-.37.368-.37h4.243c.934 0 1.8-.375 2.441-1.058.86-.915 2.104-1.44 3.417-1.44h8.856c1.312 0 2.558.525 3.416 1.44a3.316 3.316 0 0 0 2.442 1.059h4.242c.204 0 .37.165.37.369v1.103a.369.369 0 0 1-.37.369h-4.242Z"
        fill="#fff"
      />
      <Path
        d="M34.263 38.852h-1.906l-.001.369c-.001.586-.476 1.06-1.062 1.06H20.785v1.596h14.429v-2.075a.95.95 0 0 0-.951-.95Z"
        fill="#fff"
      />
      <Path
        d="M37.458 43.537H18.541v-1.474c0-.539.436-.975.975-.975h16.967c.539 0 .975.436.975.975v1.474Z"
        fill="#fff"
      />
      <Path
        d="m37.455 42.966.002-.939a.974.974 0 0 0-.974-.94h-1.932l-.002.415c0 .536-.435.97-.972.97H18.541v1.065h18.917l-.003-.571Z"
        fill="#fff"
      />
      <Path
        d="M43.532 30.625c0-.01 0-.02-.002-.031v-.015l-.005-.027c0-.007-.002-.013-.003-.02l-.005-.02-.008-.026-.005-.014a.488.488 0 0 0-.011-.03l-.002-.003-3.6-7.983h2.637a.832.832 0 0 0 .831-.831V20.52a.832.832 0 0 0-.831-.831h-4.242a2.858 2.858 0 0 1-2.105-.913c-.945-1.008-2.314-1.586-3.753-1.586h-2.926v-1.028a2.35 2.35 0 0 0 .85-1.81A2.356 2.356 0 0 0 28 12a2.356 2.356 0 0 0-2.354 2.353c0 .727.331 1.378.85 1.81v1.028h-2.924c-1.44 0-2.808.578-3.754 1.586-.552.589-1.3.913-2.105.913h-4.242a.832.832 0 0 0-.831.831v1.104c0 .458.373.831.831.831h2.627l-3.59 7.984-.002.003a.562.562 0 0 0-.011.03l-.006.014a.412.412 0 0 0-.007.025l-.005.02-.003.02-.004.027-.001.014-.002.033v.457a4.19 4.19 0 0 0 4.186 4.187h.358a4.19 4.19 0 0 0 4.186-4.187v-.458c0-.01 0-.02-.002-.03v-.017l-.005-.026-.003-.02-.005-.02-.008-.026-.005-.014a.484.484 0 0 0-.011-.03l-.002-.003-3.6-7.983h.332c1.44 0 2.808-.578 3.753-1.586a2.858 2.858 0 0 1 2.105-.913h2.751V38.39h-4.761c-.78 0-1.413.634-1.413 1.413v.823h-.807c-.793 0-1.438.645-1.438 1.438v1.474c0 .255.207.462.463.462h18.917a.463.463 0 0 0 .463-.462v-1.474c0-.793-.645-1.438-1.438-1.438h-.807v-.823c0-.78-.634-1.413-1.413-1.413h-4.761V25.02a.462.462 0 1 0-.925 0v13.37h-1.155V19.957h1.155v2.137a.462.462 0 1 0 .925 0v-2.137h2.934c.662 0 1.31.28 1.778.766a5.605 5.605 0 0 0 4.072 1.733h.147l-3.59 7.984-.002.003a.45.45 0 0 0-.012.03l-.005.014a.415.415 0 0 0-.007.027l-.005.018-.003.02-.005.027v.015a.41.41 0 0 0-.002.031v.458a4.19 4.19 0 0 0 4.186 4.187h.358a4.19 4.19 0 0 0 4.186-4.187v-.458ZM28 12.925a1.428 1.428 0 0 1 .612 2.719l-.027.012-.06.025-.026.01c-.027.01-.055.02-.082.028l-.023.007a1.41 1.41 0 0 1-.07.018l-.023.005c-.03.007-.06.012-.09.017l-.015.002a1.463 1.463 0 0 1-.078.008l-.025.002a1.45 1.45 0 0 1-.187 0l-.025-.002a1.475 1.475 0 0 1-.078-.008l-.015-.002c-.03-.005-.06-.01-.09-.017l-.024-.005a1.39 1.39 0 0 1-.069-.018l-.023-.007a1.493 1.493 0 0 1-.082-.028l-.026-.01a1.41 1.41 0 0 1-.06-.025l-.027-.013a1.341 1.341 0 0 1-.074-.038l-.028-.016A1.428 1.428 0 0 1 28 12.925Zm.577 3.71v.556h-1.155v-.556l.023.005.105.023.035.006c.036.007.072.012.108.017l.025.003a2.368 2.368 0 0 0 .562 0c.009 0 .017-.002.026-.003a2.37 2.37 0 0 0 .107-.017l.036-.006.105-.023.023-.005Zm-11.566 17.71h-.358a3.265 3.265 0 0 1-3.261-3.253h6.88a3.265 3.265 0 0 1-3.26 3.253Zm3.008-4.178h-6.375l3.183-7.078 3.192 7.078Zm9.02 9.148h5.224c.27 0 .488.219.488.488v.823h-9.657a.463.463 0 0 0 0 .925h11.39c.282 0 .512.23.512.513v1.011H19.003v-1.011c0-.283.23-.513.513-.513h2.625a.462.462 0 1 0 0-.925h-.893v-.823c0-.27.219-.488.488-.488h7.303Zm9.247-17.784a4.688 4.688 0 0 1-3.406-1.45 3.414 3.414 0 0 0-2.444-1.049H23.745c-1.063 0-2.05.428-2.778 1.205-.772.822-1.894 1.294-3.08 1.294h-4.322v-.916h4.148c1.064 0 2.05-.428 2.78-1.205.77-.822 1.893-1.294 3.079-1.294h8.856c1.185 0 2.307.472 3.079 1.294a3.774 3.774 0 0 0 2.779 1.205h4.148v.916h-4.148Zm.876 1.558 3.192 7.078h-6.375l3.183-7.078Zm.184 11.256h-.358a3.265 3.265 0 0 1-3.261-3.253h6.88a3.265 3.265 0 0 1-3.26 3.253Z"
        fill="#313131"
      />
    </Svg>
  );
};

export default SvgComponent;
