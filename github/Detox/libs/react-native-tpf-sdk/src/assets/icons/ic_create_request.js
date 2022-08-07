import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  const { color1 = '#DE761C', color2 = '#005E52', background = '#fff' } = props;
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M36.98 14.206v24.746a3.75 3.75 0 01-3.75 3.75H7.45a3.75 3.75 0 01-3.75-3.75v-34.5a3.75 3.75 0 013.75-3.75h16.05c.747 0 1.463.296 1.991.825l10.67 10.692c.525.527.82 1.242.82 1.987z"
        fill={background}
      />
      <Path
        d="M36.98 14.208v.712H27.2a4.418 4.418 0 01-4.41-4.416v-9.8h.709c.746 0 1.463.296 1.99.825l10.67 10.693c.526.526.822 1.24.822 1.986z"
        fill="#F9F8F9"
      />
      <Path
        d="M20.678 14.768H9.08a.703.703 0 110-1.407h11.597a.703.703 0 010 1.407zM20.678 31.644H9.08a.703.703 0 010-1.407h11.597a.703.703 0 010 1.407zM29.894 20.393h-21a.703.703 0 110-1.407h21a.703.703 0 010 1.407zM29.894 26.018h-21a.703.703 0 110-1.407h21a.703.703 0 010 1.407z"
        fill="#A29AA5"
      />
      <Path
        d="M34.956 47.297a9.516 9.516 0 009.516-9.516 9.516 9.516 0 10-19.032 0 9.516 9.516 0 009.516 9.516z"
        fill={color1}
      />
      <Path
        d="M42.557 43.51A9.515 9.515 0 1129.23 30.183a9.469 9.469 0 00-1.915 5.727 9.515 9.515 0 009.515 9.516c2.15 0 4.133-.713 5.726-1.916zM36.729 13.046H27.2a2.539 2.539 0 01-2.535-2.541V.959c.303.137.584.33.824.57l10.67 10.693c.239.24.432.52.569.824z"
        fill={color1}
      />
      <Path
        d="M34.965 42.986c-.776 0-1.406-.63-1.406-1.407v-2.39h-2.391a1.407 1.407 0 010-2.813h2.39v-2.39a1.407 1.407 0 012.813 0v2.39h2.39a1.407 1.407 0 010 2.813h-2.39v2.39c0 .776-.63 1.407-1.406 1.407z"
        fill={background}
      />
      <Path
        d="M20.715 1.406h2.788c.159 0 .313.02.464.053v9.045a3.245 3.245 0 003.238 3.244h9.025c.033.15.052.303.052.46v4.73a.703.703 0 001.406 0v-4.73c0-.938-.364-1.82-1.027-2.483L25.992 1.032A3.493 3.493 0 0023.503 0h-2.788a.703.703 0 100 1.406zM35.29 12.341h-8.085a1.837 1.837 0 01-1.832-1.837v-8.1l9.917 9.937zM3.703 10.547a.703.703 0 00.703-.703v-5.39a3.05 3.05 0 013.047-3.048h9.98a.703.703 0 000-1.406h-9.98A4.458 4.458 0 003 4.453v5.391c0 .388.315.703.703.703zM9.085 14.765h11.597a.703.703 0 000-1.407H9.085a.703.703 0 100 1.407zM9.085 30.233a.703.703 0 100 1.407h11.597a.703.703 0 100-1.407H9.085zM29.898 18.983h-21a.703.703 0 100 1.407h21a.703.703 0 000-1.407zM30.601 25.311a.703.703 0 00-.703-.703h-21a.703.703 0 100 1.407h21a.703.703 0 00.703-.704z"
        fill={color2}
      />
      <Path
        d="M37.688 27.932v-5.713a.703.703 0 00-1.406 0v5.428c-.431-.055-.87-.084-1.317-.084-1.342 0-2.646.256-3.877.761a.703.703 0 00.534 1.301 8.761 8.761 0 013.343-.656c.644 0 1.271.07 1.876.202h.004c3.959.864 6.933 4.396 6.933 8.61 0 4.86-3.953 8.813-8.813 8.813-4.86 0-8.813-3.953-8.813-8.812a8.832 8.832 0 012.9-6.535.703.703 0 10-.944-1.042 10.24 10.24 0 00-3.362 7.577c0 1.503.327 2.932.912 4.219H7.453a3.05 3.05 0 01-3.047-3.047V13.125a.703.703 0 00-1.406 0v25.829a4.458 4.458 0 004.453 4.453h18.985A10.218 10.218 0 0034.965 48c5.635 0 10.219-4.584 10.219-10.22 0-4.691-3.179-8.654-7.496-9.85z"
        fill={color2}
      />
      <Path
        d="M34.965 31.876c-1.163 0-2.11.946-2.11 2.11v1.687h-1.687c-1.163 0-2.11.946-2.11 2.11 0 1.162.947 2.109 2.11 2.109h1.688v1.687c0 1.163.946 2.11 2.109 2.11s2.11-.947 2.11-2.11v-1.687h1.687c1.163 0 2.11-.947 2.11-2.11 0-1.163-.947-2.11-2.11-2.11h-1.688v-1.687c0-1.163-.946-2.109-2.109-2.109zm3.797 5.203a.704.704 0 010 1.407h-2.39a.703.703 0 00-.704.703v2.39a.704.704 0 01-1.406 0v-2.39a.703.703 0 00-.703-.703h-2.391a.704.704 0 010-1.407h2.39a.703.703 0 00.704-.703v-2.39a.704.704 0 011.406 0v2.39c0 .389.315.703.703.703h2.39z"
        fill={color2}
      />
    </Svg>
  );
}

export default SvgComponent;