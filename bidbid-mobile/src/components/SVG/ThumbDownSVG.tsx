import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const ThumbDownSVG = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Path
      d="m4.526 6.182 6.29 2.481L3.92 9.915 8.5 11.72l-5.203 1.743a.886.886 0 0 0-.365.212.185.185 0 0 0-.043.072c.115.071.456.224 1.183.187h.004c.263-.013.571-.046 1.038-.098.449-.05.997-.111 1.657-.16h.001c1.387-.104 2.53-.144 3.826.127.728.152 1.571.595 2.044 1.49.509.962.356 1.996-.08 2.8L4.527 6.182Zm0 0a1.52 1.52 0 0 1 .45-.132l7.07-1.09L6.02 2.466c.169-.077.416-.142.734-.165 1.269-.093 2.93-.125 6.059.466 1.666.314 2.772.402 4.935.574.588.046 1.255.1 2.032.165.09.007.148.02.184.03a.839.839 0 0 1 .027.209v8.78c0 .572-.12.854-.183.974-.07.13-.133.192-.302.36l-.004.003-.002.002c-.51.505-1.255 1.127-2.086 1.82l-.006.006-.013.011c-.777.649-1.654 1.381-2.264 2.006-1.718 1.758-3.733 4.617-4.6 7.723-.155-.222-.294-.6-.306-1.245-.022-1.128.39-2.796 1.561-4.827L4.526 6.182Zm7.501 12.79c-.122.192-.203.32-.242.387l.242-.387Zm0 0 .082-.128m-.082.128.082-.128m0 0c.136-.215.328-.518.453-.75l-.453.75Zm13.102-6.592h-.305v-9.16h.305v9.16ZM3.353 9.688Zm16.653-6.135Z"
      fill="#F9423A"
      stroke="#F9423A"
      strokeWidth={4}
    />
  </Svg>
);

export default ThumbDownSVG;
