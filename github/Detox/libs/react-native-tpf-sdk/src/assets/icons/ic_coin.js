import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

function SvgComponent(props) {
  const { color1 = '#DE761C' } = props;
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path d="M8 16A8 8 0 108 0a8 8 0 000 16z" fill="url(#prefix__paint0_linear)" />
      <Path
        d="M8 1.906A6.1 6.1 0 001.906 8 6.1 6.1 0 008 14.094 6.1 6.1 0 0014.094 8 6.1 6.1 0 008 1.906zm0 5.625c1.034 0 1.875.841 1.875 1.875 0 .682-.368 1.276-.914 1.603-.27.161-.492.426-.492.741a.469.469 0 11-.938 0c0-.315-.221-.58-.492-.741a1.865 1.865 0 01-.914-1.603.468.468 0 11.938 0 .938.938 0 001.875 0A.938.938 0 008 8.47a1.877 1.877 0 01-1.875-1.875c0-.682.368-1.276.914-1.603.27-.161.492-.426.492-.741a.468.468 0 11.938 0c0 .315.221.58.492.741.546.327.914.92.914 1.603a.468.468 0 11-.938 0 .938.938 0 00-1.874 0c0 .517.42.937.937.937z"
        fill="url(#prefix__paint1_linear)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={8}
          y1={16.003}
          x2={8}
          y2={-0.003}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={color1} />
          <Stop offset={1} stopColor={color1} />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint1_linear"
          x1={8}
          y1={14.096}
          x2={8}
          y2={1.904}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFFFFF" />
          <Stop offset={1} stopColor="#FFFFFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
