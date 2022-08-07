import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

function SvgComponent(props) {
  const { color1 = '#EA7406', color2, background = '#fff' } = props;
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // {...props}
    >
      <Path
        d="M5.5 5.5a2 2 0 00-2 2v.575a9.334 9.334 0 01-1.255 4.783c-.186.313-.27.676-.239 1.038A1.79 1.79 0 003.811 15.5h8.378a1.79 1.79 0 001.805-1.604 1.743 1.743 0 00-.239-1.038A9.334 9.334 0 0112.5 8.075V7.5a2 2 0 00-2-2"
        fill={color1}
      />
      <Path
        d="M11.77 7.332c0-.872-.398-1.833-1.27-1.832h-5a2 2 0 00-2 2v.941a9.039 9.039 0 01-1.273 4.448c-.174.306-.25.657-.22 1.008.017.213.214.353.43.353h8.084A1.25 1.25 0 0011.77 13V7.332z"
        fill="url(#prefix__paint0_linear)"
      />
      <Path d="M8 13.25a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill={background} />
      <Path
        d="M5.5 10.75a2.498 2.498 0 001.34 2.213 2.498 2.498 0 001.57-4.676A2.486 2.486 0 005.5 10.75z"
        fill={background}
      />
      <Path
        d="M10.06 4.817l1.352-2.97A.95.95 0 0010.556.5a.95.95 0 00-.852.536l-.119.24a.397.397 0 01-.711 0L8.712.948A.795.795 0 008 .5a.794.794 0 00-.712.447l-.161.33a.398.398 0 01-.566.162.397.397 0 01-.146-.163l-.119-.24A.95.95 0 005.08.574a.945.945 0 00-.491 1.273l1.351 2.97"
        fill="url(#prefix__paint1_linear)"
      />
      <Path
        d="M6.994 2.446l-.488.108.503 2.263h.512l-.527-2.371zM8.479 4.817h.512l.503-2.263-.488-.108-.527 2.371zM7.75 2.5h.5v2.317h-.5V2.5z"
        fill={background}
      />
      <Path d="M9.75 4.75h-3.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5z" fill={background} />
      <Path
        d="M9 10.25V10a.75.75 0 00-.75-.75V9h-.5v.25A.75.75 0 007 10v.25a.75.75 0 00.75.75v.75a.25.25 0 01-.25-.25v-.25H7v.25a.75.75 0 00.75.75v.25h.5v-.25A.75.75 0 009 11.5v-.25a.75.75 0 00-.75-.75v-.75a.25.25 0 01.25.25v.25H9zm-.5 1v.25a.25.25 0 01-.25.25V11a.25.25 0 01.25.25zm-.75-.75a.25.25 0 01-.25-.25V10a.25.25 0 01.25-.25v.75z"
        fill={color2}
      />
      <Path
        d="M9.494 4.75H6.25a.75.75 0 00-.75.75h3.744a.25.25 0 00.25-.25v-.5z"
        fill={background}
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={6.885}
          y1={14.252}
          x2={6.885}
          y2={5.498}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={color1} />
          <Stop offset={1} stopColor={color1} />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint1_linear"
          x1={8}
          y1={4.818}
          x2={8}
          y2={0.499}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={color1} />
          <Stop offset={1} stopColor={color1} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
