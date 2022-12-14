import Svg, { Rect, Mask, Path, G, Defs, ClipPath, Circle } from 'react-native-svg';
import * as React from 'react';

export const IconBorderLeft = () => (
  <Svg width={16} height={16} fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.373 0 0 5.373 0 12V0h12Z" fill="#fff" />
  </Svg>
);
export const IconBorderRight = () => (
  <Svg width={16} height={16} fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M0 0c6.627 0 12 5.373 12 12V0H0Z" fill="#fff" />
  </Svg>
);

export const BidBidPush = () => (
  <Svg width={24} height={24} fill="none">
    <Circle cx={13} cy={13} r={12} fill="#312E81" stroke="#F3F4F4" strokeWidth={0.5} />
    <Path
      d="M6.73 15.961v.04c.05-.01.103-.015.153-.026.625-.167 1.247-.336 1.875-.494a.466.466 0 0 1 .306.039c.564.3 1.16.475 1.794.516a4.34 4.34 0 0 0 4.492-3.233c.15-.572.203-1.175.108-1.761a4.356 4.356 0 0 0-5.083-3.62c-2.678.478-4.283 3.317-3.272 5.84.166.413.2.766.06 1.177-.169.5-.29 1.014-.433 1.522Z"
      fill="#F9423A"
    />
    <Path
      d="M19.27 18.564v.039c-.05-.009-.104-.014-.154-.025-.625-.167-1.247-.336-1.875-.495a.465.465 0 0 0-.305.04c-.564.3-1.161.474-1.795.516a4.34 4.34 0 0 1-4.491-3.233 4.283 4.283 0 0 1-.109-1.761 4.356 4.356 0 0 1 5.084-3.62c2.677.475 4.283 3.314 3.272 5.836-.167.414-.2.767-.061 1.178.17.5.292 1.017.433 1.525Z"
      fill="#69B3E7"
    />
    <Path
      d="M15.347 12.803c.15-.572.203-1.175.109-1.761a4.434 4.434 0 0 0-.314-1.078 4.356 4.356 0 0 0-4.595 3.68 4.19 4.19 0 0 0 .108 1.762c.059.219.134.43.22.633a4.341 4.341 0 0 0 4.472-3.236Z"
      fill="#4C12A1"
    />
  </Svg>
);

export const IconAppleSquare = () => (
  <Svg width={40} height={40} fill="none">
    <Rect width={40} height={40} rx={10} fill="#F3F3F4" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.257 13.191c-.654.814-1.752 1.424-2.628 1.424-.098 0-.197-.012-.259-.025a1.79 1.79 0 0 1-.037-.356c0-1.043.506-2.06 1.061-2.708.703-.852 1.875-1.488 2.85-1.526.024.114.037.254.037.394 0 1.03-.432 2.06-1.024 2.797Zm-4.29 16.43c-.44.195-.857.379-1.422.379-1.209 0-2.048-1.144-3.01-2.543-1.122-1.653-2.035-4.209-2.035-6.624 0-3.89 2.455-5.95 4.872-5.95.706 0 1.351.266 1.924.503.46.19.872.361 1.234.361.314 0 .706-.16 1.162-.345.637-.26 1.4-.57 2.255-.57.543 0 2.53.05 3.837 1.983a.932.932 0 0 1-.047.033c-.322.219-2.038 1.386-2.038 3.781 0 2.963 2.504 4.018 2.59 4.044a1.345 1.345 0 0 0-.015.048c-.082.262-.475 1.514-1.317 2.787-.826 1.22-1.702 2.466-3.01 2.466-.644 0-1.055-.187-1.479-.38-.452-.207-.92-.42-1.703-.42-.788 0-1.307.23-1.798.447Z"
      fill="#000"
    />
  </Svg>
);
export const IconApple = () => (
  <Svg width={48} height={48} fill="none">
    <Rect width={48} height={48} rx={24} fill="#F3F3F4" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.908 15.83c-.785.976-2.102 1.708-3.153 1.708a1.65 1.65 0 0 1-.31-.03 2.156 2.156 0 0 1-.045-.427c0-1.251.607-2.472 1.273-3.25.844-1.022 2.25-1.785 3.42-1.831.029.137.044.305.044.473 0 1.236-.519 2.472-1.23 3.357ZM22.76 35.545c-.528.234-1.027.455-1.706.455-1.45 0-2.457-1.373-3.612-3.051-1.347-1.984-2.442-5.05-2.442-7.95 0-4.668 2.946-7.14 5.847-7.14.847 0 1.62.32 2.309.605.55.228 1.046.433 1.48.433.377 0 .847-.192 1.394-.414.764-.312 1.68-.685 2.707-.685.651 0 3.034.061 4.603 2.38-.009.008-.028.02-.056.04-.386.262-2.445 1.663-2.445 4.538 0 3.554 3.005 4.82 3.108 4.851l-.018.058a13.6 13.6 0 0 1-1.58 3.345c-.992 1.464-2.043 2.96-3.612 2.96-.774 0-1.266-.225-1.775-.457-.543-.248-1.104-.505-2.044-.505-.945 0-1.569.276-2.158.537Z"
      fill="#000"
    />
  </Svg>
);
export const AppIcon = () => (
  <Svg width={50} height={50} fill="none">
    <Path
      d="M.49 33.104v.146c.187-.031.385-.052.572-.094 2.344-.625 4.677-1.26 7.032-1.854a1.745 1.745 0 0 1 1.145.146c2.115 1.125 4.354 1.781 6.73 1.938 7.802.53 14.843-4.553 16.843-12.126.563-2.145.76-4.406.407-6.604C31.77 5.552 23.228-.542 14.155 1.083 4.114 2.875-1.906 13.521 1.886 22.98c.624 1.552.75 2.875.228 4.417-.635 1.875-1.093 3.802-1.625 5.708Z"
      fill="#F9423A"
    />
    <Path
      d="M47.51 42.865v.146c-.187-.032-.385-.053-.573-.094-2.343-.625-4.677-1.26-7.03-1.854a1.745 1.745 0 0 0-1.147.145c-2.114 1.126-4.354 1.782-6.729 1.938-7.802.531-14.844-4.552-16.844-12.125-.562-2.146-.76-4.406-.406-6.604 1.448-9.104 9.99-15.198 19.063-13.573 10.041 1.781 16.062 12.427 12.27 21.885-.625 1.552-.75 2.875-.229 4.417.636 1.875 1.094 3.813 1.625 5.719Z"
      fill="#69B3E7"
    />
    <Path
      d="M32.802 21.26c.562-2.145.76-4.406.406-6.604a16.629 16.629 0 0 0-1.177-4.041c-8.354-.563-15.875 5.302-17.23 13.802-.364 2.198-.166 4.458.407 6.604.219.823.5 1.614.823 2.375 7.76.49 14.792-4.583 16.77-12.136Z"
      fill="#4C12A1"
    />
  </Svg>
);

export const IconAuctionSetting = () => (
  <Svg width={28} height={28} fill="none">
    <Rect width={28} height={28} rx={14} fill="#CFD1D2" />
    <Mask id="a" x={5} y={5} width={18} height={18}>
      <Path fill="#C4C4C4" d="M5 5h18v18H5z" />
    </Mask>
    <G clipPath="url(#b)" fill="#fff">
      <Path d="M20.887 14.92c-.466 0-.878.3-1.022.745a5.99 5.99 0 0 1-5.69 4.144 5.991 5.991 0 0 1-5.984-5.984 5.989 5.989 0 0 1 4.116-5.68c.46-.152.773-.583.773-1.07a1.076 1.076 0 0 0-1.406-1.024C8.387 7.11 6 10.191 6 13.825c0 4.508 3.667 8.175 8.174 8.175 3.62 0 6.69-2.367 7.76-5.633a1.103 1.103 0 0 0-1.048-1.447ZM16.013 8.136a6.004 6.004 0 0 1 3.847 3.838c.148.452.568.757 1.044.757h.022a1.074 1.074 0 0 0 1.022-1.403 8.194 8.194 0 0 0-5.259-5.271 1.086 1.086 0 0 0-1.42 1.032v.024c0 .466.3.88.744 1.023Z" />
    </G>
    <Defs>
      <ClipPath id="b">
        <Path fill="#fff" transform="translate(6 6)" d="M0 0h16v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const IconCareerStrengthsSetting = () => (
  <Svg width={28} height={28} fill="none">
    <Rect width={28} height={28} rx={14} fill="#CFD1D2" />
    <Mask id="a" x={5} y={5} width={18} height={18}>
      <Path fill="#C4C4C4" d="M5 5h18v18H5z" />
    </Mask>
    <G clipPath="url(#b)" fill="#fff">
      <Path d="M11.363 21.5h6.153v-6.517l.879-1.758V7.379h-1.758V6.5h-6.153v3.545h-.879v3.258l1.758 1.758V21.5Zm5.274-.879h-4.395v-3.545h4.395v3.545Zm.879-12.363v1.787h-.88V8.258h.88Zm-1.758-.88v2.667h-.88V7.379h.88Zm-1.758 0v2.667h-.879V7.379H14Zm-2.637 0h.88v2.667h-.88V7.379Zm-.879 5.561v-2.015h3.44a1.32 1.32 0 0 1-1.242.879h-1.319v.879h1.758a.88.88 0 0 1 .879.878h.879c0-.59-.293-1.113-.741-1.432.35-.31.6-.73.697-1.204h2.68v2.093l-.878 1.758v1.422h-4.395v-1.5l-1.758-1.758ZM6.508 11.142l1.885-.601.267.837-1.885.602-.267-.838ZM19.345 8.713l1.885-.6.267.837-1.885.601-.267-.838ZM6.508 8.95l.267-.838 1.885.6-.267.838-1.885-.6ZM19.342 11.373l.268-.838 1.884.601-.267.838-1.885-.601Z" />
    </G>
    <Defs>
      <ClipPath id="b">
        <Path fill="#fff" transform="translate(6.5 6.5)" d="M0 0h15v15H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
