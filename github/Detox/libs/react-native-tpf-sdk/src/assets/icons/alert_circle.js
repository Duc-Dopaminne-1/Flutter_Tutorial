import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  const { color1 = '#FF951F' } = props;
  return (
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M12 1c6.1 0 11 4.9 11 11s-4.9 11-11 11S1 18.1 1 12 5.9 1 12 1zm0 20c5 0 9-4 9-9s-4-9-9-9-9 4-9 9 4 9 9 9z"
        fill={color1}
      />
      <Path
        d="M12 11c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1s-1-.4-1-1v-4c0-.6.4-1 1-1zM12 7c.3 0 .5.1.7.3.2.2.3.4.3.7 0 .1 0 .3-.1.4-.1.1-.1.2-.2.3-.3.3-.7.4-1.1.2-.1 0-.1 0-.2-.1 0 0-.1-.1-.2-.1-.1-.1-.2-.2-.2-.3V8c0-.1 0-.3.1-.4.1-.1.1-.2.2-.3.2-.2.4-.3.7-.3z"
        fill={color1}
      />
    </Svg>
  );
}

export default SvgComponent;
