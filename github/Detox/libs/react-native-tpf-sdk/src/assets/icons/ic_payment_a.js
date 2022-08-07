import * as React from 'react';
import Svg, { Rect, G, Path, Ellipse, Defs, ClipPath } from 'react-native-svg';

const SvgComponent = props => {
  const { color1, color2, background } = props;
  return (
    <Svg width={56} height={56} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Rect width={56} height={56} rx={12} fill={color2 || '#178C77'} />
      <G clipPath="url(#a)">
        <Path
          d="M13 22a2 2 0 0 1 2-2h26a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V22Z"
          fill="#fff"
        />
        <Ellipse cx={41.613} cy={20.364} rx={4.682} ry={4.162} fill="#fff" />
        <Path
          d="M23.337 22.445H18.27c-.611 0-1.108.499-1.108 1.112v4.018c0 .613.497 1.112 1.108 1.112h5.067c.61 0 1.108-.499 1.108-1.113v-4.017c0-.613-.497-1.112-1.108-1.112Zm.225 1.112v1.566h-2.317V23.33h2.092c.124 0 .225.102.225.226Zm-5.517 4.018v-4.018c0-.124.1-.226.225-.226h2.092v4.47H18.27a.226.226 0 0 1-.225-.226Zm5.292.226h-2.092v-1.792h2.317v1.565a.226.226 0 0 1-.225.227ZM17.162 34.41c0 .287.207.52.463.52h13.64c.256 0 .463-.233.463-.52 0-.287-.207-.52-.463-.52h-13.64c-.256 0-.463.233-.463.52ZM17.598 35.97c-.241 0-.436.233-.436.52 0 .288.195.521.436.521h6.411c.24 0 .436-.233.436-.52 0-.288-.195-.52-.436-.52h-6.411ZM26.526 32.378V31.24c0-.26-.233-.47-.52-.47-.288 0-.52.21-.52.47v1.14c0 .26.232.47.52.47.287 0 .52-.21.52-.47ZM28.607 32.378V31.24c0-.26-.233-.47-.52-.47-.288 0-.52.21-.52.47v1.14c0 .26.232.47.52.47.287 0 .52-.21.52-.47ZM30.688 32.378V31.24c0-.26-.233-.47-.52-.47-.288 0-.52.21-.52.47v1.14c0 .26.232.47.52.47.287 0 .52-.21.52-.47ZM32.769 32.378V31.24c0-.26-.233-.47-.52-.47-.288 0-.52.21-.52.47v1.14c0 .26.232.47.52.47.287 0 .52-.21.52-.47ZM35.89 31.24v1.138c0 .26.233.471.52.471.288 0 .52-.21.52-.47v-1.14c0-.26-.232-.47-.52-.47-.287 0-.52.21-.52.47ZM37.971 31.24v1.138c0 .26.233.471.52.471.288 0 .52-.21.52-.47v-1.14c0-.26-.233-.47-.52-.47-.287 0-.52.21-.52.47ZM40.052 31.24v1.138c0 .26.233.471.52.471.287 0 .52-.21.52-.47v-1.14c0-.26-.233-.47-.52-.47-.287 0-.52.21-.52.47ZM17.682 32.85c.287 0 .52-.212.52-.472V31.24c0-.26-.233-.47-.52-.47-.287 0-.52.21-.52.47v1.14c0 .26.233.47.52.47ZM20.283 32.378V31.24c0-.26-.233-.47-.52-.47-.287 0-.52.21-.52.47v1.14c0 .26.233.47.52.47.287 0 .52-.21.52-.47ZM22.364 32.378V31.24c0-.26-.233-.47-.52-.47-.287 0-.52.21-.52.47v1.14c0 .26.233.47.52.47.287 0 .52-.21.52-.47Z"
          fill="#313131"
        />
        <Path
          d="M43.728 34.809a.489.489 0 0 0-.486.491v2.028c0 1.004-.808 1.821-1.8 1.821h-25.67c-.992 0-1.8-.817-1.8-1.82V22.126c0-1.003.808-1.82 1.8-1.82h5.76c.27 0 .487-.22.487-.492a.489.489 0 0 0-.486-.492h-5.76c-1.53 0-2.773 1.258-2.773 2.804v15.201c0 1.546 1.244 2.804 2.772 2.804h25.67c1.528 0 2.772-1.258 2.772-2.804V35.3a.489.489 0 0 0-.486-.491Z"
          fill="#313131"
        />
        <Path
          d="M40.052 28.932v-1.53c0-.439-.324-.796-.722-.796h-4.798c-.399 0-.723.357-.723.796v1.53c0 .439.324.796.723.796h4.798c.398 0 .722-.357.722-.796Zm-.94-.24H34.75v-1.05h4.363v1.05Z"
          fill="#313131"
        />
        <Path
          d="M46.295 20.266c0-2.815-2.218-5.105-4.943-5.105-2.441 0-4.473 1.838-4.871 4.244H23.89a.495.495 0 0 0-.486.502c0 .278.217.503.486.503h12.52c.074 2.766 2.285 4.96 4.939 4.961h.003c.711 0 1.4-.162 1.996-.434v8.45c0 .278.218.503.487.503a.495.495 0 0 0 .486-.503v-9.044a5.157 5.157 0 0 0 1.973-4.077Zm-4.943-4.1c2.189 0 3.97 1.84 3.97 4.1 0 2.265-1.786 4.1-3.97 4.1-2.232 0-4.057-1.918-3.966-4.266.102-2.258 1.888-3.934 3.966-3.934Z"
          fill="#313131"
        />
        <Path
          d="M39.991 22.002a.49.49 0 0 0 .76.088l3.155-3.127a.48.48 0 0 0 0-.684.49.49 0 0 0-.69 0l-2.719 2.695-1.052-1.69a.49.49 0 0 0-.67-.157c-.23.14-.301.438-.16.665l1.376 2.21Z"
          fill={color1 || '#FF951F'}
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" transform="translate(13 11)" d="M0 0h33.295v33H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default SvgComponent;
