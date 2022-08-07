// import * as shape from 'd3-shape';
// import React from 'react';
// import { Dimensions, Platform, StyleSheet, View } from 'react-native';
// import Svg, { Path } from 'react-native-svg';
// import { CUSTOM_COLOR } from '../../../constants/colors';
// import { BOTTOM_TAB_HEIGHT } from '../../../constants/size';
// import { Shadow } from '../../../constants/stylesCSS';
// import { scale } from '../../../utils/responsive';
// import StaticTabBar, { tabHeight as height } from './StaticTabBar';

// const { width } = Dimensions.get('window');

// const tabs = [
//   { name: 'grid' },
//   { name: 'list' },
//   { name: 'refresh-cw' },
//   { name: 'box' },
//   { name: 'user' }
// ];

// const tabWidth = width / tabs.length;

// const left = shape.line()([
//   [0, 0],
//   [width, 0]
// ]);
// const tab = shape.line().curve(shape.curveBasis)([
//   [width - scale(15), 0],
//   [width - scale(0), 0],
//   [width + scale(0), scale(10)],
//   [width + scale(15), scale(BOTTOM_TAB_HEIGHT - 25)],
//   [width + tabWidth - scale(15), scale(BOTTOM_TAB_HEIGHT - 25)],
//   [width + tabWidth - scale(0), scale(10)],
//   [width + tabWidth, 0],
//   [width + tabWidth + scale(15), 0]
// ]);

// const right = shape.line()([
//   [width + tabWidth, 0],
//   [width * 2, 0],
//   [width * 2, scale(BOTTOM_TAB_HEIGHT)],
//   [0, scale(BOTTOM_TAB_HEIGHT)],
//   [0, 0]
// ]);

// const d = `${left} ${tab} ${right}`;

// // const AnimatedSvg = Animated.createAnimatedComponent(Svg);

// const TabBar = props => {
//   // const value = useMemo(() => new Animated.Value(-width + tabWidth * 2), []);
//   // const translateX = useMemo(() => value, [value]);
//   return (
//     <>
//       <View {...{ width, height }}>
//         <Svg
//           width={width * 2}
//           {...{ height }}
//           style={{
//             transform: [{ translateX: -width + tabWidth * 2 }],
//             ...(Platform.OS === 'ios' && Shadow)
//           }}>
//           <Path
//             {...{ d }}
//             fill={CUSTOM_COLOR.White}
//             {...(Platform.OS === 'android' && {
//               strokeWidth: 2,
//               stroke: 'rgba(219, 219, 219, 0.5)'
//             })}
//           />
//         </Svg>
//         <View style={[StyleSheet.absoluteFill, { elevation: 5 }]}>
//           <StaticTabBar value={-width + tabWidth * 2} {...props} />
//         </View>
//       </View>
//     </>
//   );
// };

// export default React.memo(TabBar);
