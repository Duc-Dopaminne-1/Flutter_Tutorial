import * as React from 'react';
import Svg, { SvgProps, G, Rect, Path, Circle, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const ChatEmptySVG = (props: SvgProps) => (
  <Svg width={163} height={106} fill="none" {...props}>
    <G>
      <Rect x={27.433} y={48} width={60} height={30} rx={3} fill="#FED9D7" />
    </G>
    <Path d="M41.1 78h-11s-.563 3.799-.654 7.906c-.014.588.495 1.03 1.038.806C34.246 85.156 41.1 78 41.1 78Z" fill="#FCA19C" />
    <Rect x={38.433} y={58} width={40} height={2} rx={1} fill="#FCA19C" />
    <Rect x={38.433} y={65} width={18} height={2} rx={1} fill="#FCA19C" />
    <G>
      <Rect width={60} height={30} rx={3} transform="matrix(-1 0 0 1 129.433 24)" fill="#DCEDFA" />
    </G>
    <Path d="M115.767 54h11s.562 3.799.654 7.906c.013.588-.496 1.03-1.039.806C122.62 61.156 115.767 54 115.767 54Z" fill="#CAE4F7" />
    <Rect width={40} height={2} rx={1} transform="matrix(-1 0 0 1 118.433 34)" fill="#B8DBF4" />
    <Rect width={40} height={2} rx={1} transform="matrix(-1 0 0 1 118.433 40)" fill="#B8DBF4" />
    <Rect width={18} height={2} rx={1} transform="matrix(-1 0 0 1 96.433 46)" fill="#B8DBF4" />
    <Rect x={58.433} y={92} width={40} height={14} rx={7} fill="#DCEDFA" />
    <Circle cx={69.433} cy={99} r={2} fill="#96C9EE" />
    <Circle cx={78.433} cy={99} r={2} fill="#96C9EE" />
    <Circle cx={87.433} cy={99} r={2} fill="#96C9EE" />
    <G opacity={0.2}>
      <Path
        d="M136.241 6.175c-.16.44-.72.83-1.766.951-1.014.117-2.332-.048-3.702-.546-1.37-.5-2.486-1.22-3.187-1.961-.725-.765-.902-1.424-.742-1.864.16-.44.719-.83 1.766-.95 1.013-.117 2.332.047 3.702.546 1.37.499 2.486 1.22 3.187 1.96.724.766.902 1.425.742 1.864Z"
        stroke="#F9423A"
      />
      <Path
        d="M95.309 6.098c.502.87.534 1.982.056 3.134-.478 1.153-1.452 2.29-2.837 3.09-1.386.8-2.858 1.075-4.095.912-1.237-.162-2.184-.745-2.686-1.615-.502-.87-.534-1.982-.056-3.134.478-1.153 1.451-2.29 2.837-3.09 1.385-.8 2.857-1.075 4.095-.912 1.236.162 2.183.745 2.686 1.615Z"
        stroke="#4C12A1"
        strokeWidth={2}
      />
      <Path
        d="M5.638 44.971c2.4.223 3.839 1.92 3.7 3.427-.14 1.508-1.866 2.912-4.267 2.69-2.4-.223-3.84-1.92-3.7-3.428.14-1.507 1.866-2.911 4.267-2.689Z"
        stroke="#69B3E7"
        strokeWidth={2}
      />
      <Rect x={154.682} y={28} width={1.502} height={15.019} rx={0.751} fill="#EAB308" />
      <Rect x={147.912} y={34.874} width={1.502} height={15.019} rx={0.751} transform="rotate(-79.465 147.912 34.874)" fill="#EAB308" />
      <Rect x={36.743} y={23.682} width={0.703} height={7.03} rx={0.351} transform="rotate(93.923 36.743 23.682)" fill="#EAB308" />
      <Rect x={33.749} y={20.3} width={0.703} height={7.03} rx={0.351} transform="rotate(14.459 33.749 20.3)" fill="#EAB308" />
      <Rect x={12.748} y={73.126} width={1.003} height={10.026} rx={0.501} transform="rotate(93.923 12.748 73.126)" fill="#EAB308" />
      <Rect x={8.479} y={68.304} width={1.003} height={10.026} rx={0.501} transform="rotate(14.459 8.479 68.304)" fill="#EAB308" />
    </G>
    <Defs></Defs>
  </Svg>
);

export default ChatEmptySVG;
