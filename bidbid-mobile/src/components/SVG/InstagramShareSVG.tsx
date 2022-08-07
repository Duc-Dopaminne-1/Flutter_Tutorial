import * as React from 'react';
import Svg, { Path, Defs, RadialGradient, Stop } from 'react-native-svg';

const InstagramShareSVG = () => (
  <Svg width={30} height={30} fill="none">
    <Path
      d="m22.908 29.202-15.79.015C3.645 29.221.8 26.382.796 22.907L.781 7.119C.778 3.645 3.617.8 7.091.796L22.88.781c3.473-.003 6.317 2.836 6.321 6.31l.015 15.79c.004 3.474-2.835 6.318-6.31 6.321Z"
      fill="url(#a)"
    />
    <Path
      d="m22.908 29.202-15.79.015C3.645 29.221.8 26.382.796 22.907L.781 7.119C.778 3.645 3.617.8 7.091.796L22.88.781c3.473-.003 6.317 2.836 6.321 6.31l.015 15.79c.004 3.474-2.835 6.318-6.31 6.321Z"
      fill="url(#b)"
    />
    <Path
      d="M15 20.526A5.533 5.533 0 0 1 9.474 15 5.533 5.533 0 0 1 15 9.474 5.533 5.533 0 0 1 20.526 15 5.533 5.533 0 0 1 15 20.526Zm0-9.473A3.952 3.952 0 0 0 11.053 15 3.952 3.952 0 0 0 15 18.947 3.952 3.952 0 0 0 18.947 15 3.952 3.952 0 0 0 15 11.053ZM20.922 10.263a1.184 1.184 0 1 0 0-2.369 1.184 1.184 0 0 0 0 2.369Z"
      fill="#fff"
    />
    <Path
      d="M19.737 25.264h-9.473a5.533 5.533 0 0 1-5.527-5.527v-9.473a5.533 5.533 0 0 1 5.527-5.527h9.473a5.533 5.533 0 0 1 5.527 5.527v9.473a5.533 5.533 0 0 1-5.527 5.527ZM10.264 6.316a3.952 3.952 0 0 0-3.948 3.948v9.473a3.952 3.952 0 0 0 3.948 3.948h9.473a3.952 3.952 0 0 0 3.948-3.948v-9.473a3.952 3.952 0 0 0-3.948-3.948h-9.473Z"
      fill="#fff"
    />
    <Defs>
      <RadialGradient id="a" cx={0} cy={0} r={1} gradientUnits="userSpaceOnUse" gradientTransform="translate(11.352 29.238) scale(35.4466)">
        <Stop stopColor="#FD5" />
        <Stop offset={0.328} stopColor="#FF543F" />
        <Stop offset={0.348} stopColor="#FC5245" />
        <Stop offset={0.504} stopColor="#E64771" />
        <Stop offset={0.643} stopColor="#D53E91" />
        <Stop offset={0.761} stopColor="#CC39A4" />
        <Stop offset={0.841} stopColor="#C837AB" />
      </RadialGradient>
      <RadialGradient id="b" cx={0} cy={0} r={1} gradientUnits="userSpaceOnUse" gradientTransform="matrix(23.5366 0 0 15.6824 5.357 .426)">
        <Stop stopColor="#4168C9" />
        <Stop offset={0.999} stopColor="#4168C9" stopOpacity={0} />
      </RadialGradient>
    </Defs>
  </Svg>
);

export default InstagramShareSVG;
