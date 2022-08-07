import * as React from 'react';
import Svg, { SvgProps, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const IconThankCharitySVG = (props: SvgProps) => (
  <Svg width={22} height={20} fill="none" {...props}>
    <Path
      d="M11.427 2.544a.745.745 0 0 1-.527-.218L9.846 1.272A.745.745 0 1 1 10.9.218l.527.527.527-.527a.745.745 0 0 1 1.054 1.054l-1.054 1.054a.746.746 0 0 1-.527.218Z"
      fill="url(#a)"
    />
    <Path
      d="M7.969 19.729a6.076 6.076 0 0 1-4.325-1.791l-1.531-1.533a5.505 5.505 0 0 1 0-7.786l.638-.638c.214-.214.41-.512.6-.8.444-.678 1.117-1.7 2.315-1.302.544.182.917.589 1.049 1.146.013.057.024.116.032.175l2.78-2.78a1.935 1.935 0 0 1 3.148.614 1.934 1.934 0 0 1 2.658 2.381 1.935 1.935 0 0 1 .968 2.842 1.936 1.936 0 0 1 .553 3.121l-4.56 4.56a6.078 6.078 0 0 1-4.325 1.79ZM5.167 7.112c-.15 0-.309.167-.719.79-.215.328-.459.7-.768 1.009l-.638.638a4.19 4.19 0 0 0 0 5.926l1.532 1.532a4.802 4.802 0 0 0 6.789 0l4.56-4.559a.616.616 0 0 0-.436-1.054.616.616 0 0 0-.437.181l-2.454 2.454a.657.657 0 0 1-.93-.93l3.433-3.433a.618.618 0 1 0-.873-.873l-3.433 3.433a.658.658 0 0 1-.93-.93l4.08-4.082a.617.617 0 0 0-.872-.873l-4.082 4.081a.657.657 0 0 1-.93-.93l3.271-3.27a.617.617 0 0 0-.874-.873l-5.588 5.589a.658.658 0 1 1-.93-.93c1.358-1.358 1.578-2.324 1.494-2.68-.026-.11-.076-.164-.184-.2a.262.262 0 0 0-.081-.016Z"
      fill="url(#b)"
    />
    <Path
      d="M11.505 19.763c-.659 0-1.313-.11-1.936-.324a.66.66 0 0 1-.284-1.06.657.657 0 0 1 .71-.184c1.707.585 3.58.134 4.892-1.178l5.117-5.116a.617.617 0 0 0-.874-.873l-.327.327a.658.658 0 0 1-.93-.93l1.307-1.307a.617.617 0 1 0-.873-.872l-.275.276a.658.658 0 0 1-.93-.93l.924-.925a.618.618 0 0 0-.873-.873l-.296.297a.657.657 0 1 1-.93-.93l.296-.297a1.934 1.934 0 0 1 3.191 2.004 1.935 1.935 0 0 1 .966 2.842 1.932 1.932 0 0 1 .554 3.12l-5.116 5.117c-1.184 1.184-2.733 1.816-4.313 1.816Z"
      fill="url(#c)"
    />
    <Path d="M14.935 3.729a.658.658 0 0 1-.465-1.123l.79-.79a.658.658 0 0 1 .93.93l-.79.79a.655.655 0 0 1-.465.193Z" fill="url(#d)" />
    <Path d="M7.92 3.729a.655.655 0 0 1-.465-.193l-.79-.79a.658.658 0 0 1 .93-.93l.79.79A.658.658 0 0 1 7.92 3.73Z" fill="url(#e)" />
    <Defs>
      <LinearGradient id="a" x1={9.654} y1={1.272} x2={13.226} y2={1.272} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FA6861" />
        <Stop offset={0.5} stopColor="#FB7B74" />
        <Stop offset={1} stopColor="#FACC15" />
        <Stop offset={1} stopColor="#F9423A" />
      </LinearGradient>
      <LinearGradient id="b" x1={0.623} y1={11.791} x2={17.42} y2={11.791} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FA6861" />
        <Stop offset={0.5} stopColor="#FB7B74" />
        <Stop offset={1} stopColor="#FACC15" />
        <Stop offset={1} stopColor="#F9423A" />
      </LinearGradient>
      <LinearGradient id="c" x1={9.209} y1={12.031} x2={21.5} y2={12.031} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FA6861" />
        <Stop offset={0.5} stopColor="#FB7B74" />
        <Stop offset={1} stopColor="#FACC15" />
        <Stop offset={1} stopColor="#F9423A" />
      </LinearGradient>
      <LinearGradient id="d" x1={14.293} y1={2.679} x2={16.378} y2={2.679} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FA6861" />
        <Stop offset={0.5} stopColor="#FB7B74" />
        <Stop offset={1} stopColor="#FACC15" />
        <Stop offset={1} stopColor="#F9423A" />
      </LinearGradient>
      <LinearGradient id="e" x1={6.493} y1={2.679} x2={8.578} y2={2.679} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FA6861" />
        <Stop offset={0.5} stopColor="#FB7B74" />
        <Stop offset={1} stopColor="#FACC15" />
        <Stop offset={1} stopColor="#F9423A" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default IconThankCharitySVG;
