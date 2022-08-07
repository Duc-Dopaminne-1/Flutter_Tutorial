import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#prefix__clip0)">
        <Path
          d="M22.5 10.1a1.031 1.031 0 100-2.062 1.031 1.031 0 000 2.063zM14.77 7.493a1.031 1.031 0 100-2.062 1.031 1.031 0 000 2.062z"
          fill="#F08C31"
        />
        <Path d="M6 2.531A1.031 1.031 0 106 .47 1.031 1.031 0 006 2.53z" fill="#fff" />
        <Path
          d="M16.964 17.778l-15.578 5.71a.682.682 0 01-.874-.874l5.71-15.578a.682.682 0 011.122-.248l9.868 9.868c.352.352.22.95-.248 1.122z"
          fill="#F08C31"
        />
        <Path
          d="M1.857 18.979l-.02.02-1.325 3.615a.682.682 0 00.874.874l3.645-1.336-3.174-3.173z"
          fill="#F08C31"
        />
        <Path d="M2.772 16.73l4.499 4.498 4.147-1.544-7.102-7.102-1.544 4.147z" fill="#fff" />
        <Path
          d="M5.056 22.143l-3.2-3.199.916-2.215 4.499 4.499-2.215.915zM11.418 19.684l-7.102-7.102.812-2.318 8.608 8.608-2.318.812z"
          fill="#fff"
        />
        <Path
          d="M23.074 13.38a.469.469 0 00-.194-.635 7.351 7.351 0 00-8.106.81l-.758-.758 1.237-1.237a.469.469 0 10-.663-.663l-1.237 1.237-3.018-3.018a6.546 6.546 0 001.255-3.153 6.515 6.515 0 00-.723-3.84.469.469 0 10-.827.44 5.583 5.583 0 01-.376 5.882L7.676 6.457a1.145 1.145 0 00-1.062-.31 1.145 1.145 0 00-.832.727L.072 22.452a1.14 1.14 0 00.266 1.21 1.14 1.14 0 001.21.266l15.578-5.71c.37-.136.642-.447.727-.832a1.146 1.146 0 00-.31-1.062l-2.102-2.102a6.413 6.413 0 017-.649.469.469 0 00.633-.194zM7.466 20.76L3.24 16.534l1.17-3.195 6.25 6.25-3.194 1.171zm-2.29.84L2.4 18.825l.484-1.32 3.612 3.61-1.32.485zm-3.95 1.448a.204.204 0 01-.225-.05.204.204 0 01-.049-.223l1.092-2.98 2.161 2.16-2.98 1.093zm15.712-5.864a.207.207 0 01-.135.154l-2.882 1.056-2.666-2.666a.469.469 0 00-.663.663l2.36 2.359-1.321.484-6.865-6.865.484-1.32 2.36 2.359a.467.467 0 00.662 0 .469.469 0 000-.663l-2.666-2.666 1.056-2.882a.207.207 0 01.154-.135.204.204 0 01.196.057l9.868 9.868a.207.207 0 01.058.197zM14.137 3.74c.26 0 .47-.21.47-.468 0-.393.319-.712.711-.712.91 0 1.65-.74 1.65-1.65a.469.469 0 00-.938 0c0 .393-.32.713-.712.713-.91 0-1.65.74-1.65 1.65 0 .258.21.468.47.468zM18.296 8.165c.94 0 1.704-.764 1.704-1.703 0-.422.343-.766.766-.766a.469.469 0 000-.938c-.94 0-1.704.765-1.704 1.704a.767.767 0 01-.766.766.469.469 0 000 .937zM21 9.07c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5c0-.828-.673-1.5-1.5-1.5s-1.5.672-1.5 1.5zm1.5-.563a.563.563 0 11-.001 1.126.563.563 0 01.001-1.126z"
          fill="#005E52"
        />
        <Path
          d="M14.77 7.962c.828 0 1.5-.673 1.5-1.5s-.672-1.5-1.5-1.5c-.826 0-1.5.673-1.5 1.5s.674 1.5 1.5 1.5zm0-2.063a.563.563 0 110 1.127.563.563 0 010-1.127zM6 3c.827 0 1.5-.673 1.5-1.5S6.827 0 6 0 4.5.673 4.5 1.5 5.173 3 6 3zM6 .937A.563.563 0 116 2.064.563.563 0 016 .937zM21.211 16.456a.469.469 0 00-.663.663l.442.442a.467.467 0 00.663 0 .469.469 0 000-.663l-.442-.442zM23.42 18.666a.469.469 0 10-.662.662l.442.442a.467.467 0 00.663 0 .469.469 0 000-.663l-.442-.441zM23.2 16.456l-.442.442a.469.469 0 10.663.663l.442-.442a.469.469 0 00-.663-.663zM20.99 18.666l-.442.441a.469.469 0 00.663.663l.442-.442a.469.469 0 10-.663-.662zM23.09 1.38c.12 0 .24-.046.33-.138L23.864.8A.469.469 0 1023.2.137l-.442.442a.469.469 0 00.331.8zM20.88 3.59c.12 0 .24-.047.331-.138l.442-.442a.469.469 0 10-.663-.663l-.442.442a.469.469 0 00.332.8zM23.42 2.347a.469.469 0 10-.662.663l.442.442a.467.467 0 00.663 0 .469.469 0 000-.663l-.442-.442zM20.99 1.242a.467.467 0 00.663 0 .469.469 0 000-.663L21.21.137a.469.469 0 00-.663.663l.442.442zM9.432 14.099a.473.473 0 00-.469.469.472.472 0 00.47.469.473.473 0 00.468-.47.472.472 0 00-.469-.468zM16.271 9.216l-.34.34a.469.469 0 00.663.663l.34-.34a.469.469 0 00-.663-.663z"
          fill="#005E52"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path fill="#fff" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
