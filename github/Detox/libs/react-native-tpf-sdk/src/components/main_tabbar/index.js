// import React from 'react';
// import { View } from 'react-native';
// import { BOTTOM_TAB_HEIGHT, DEVICE_WIDTH } from '../../constants/size';
// import { scale } from '../../utils/responsive';
// import BottomTabBar from './bottom_tab/TabBar';

// const TabBar = props => {
//   const { state, descriptors, navigation } = props;

//   const focusedOptions = descriptors[state.routes[state.index].key].options;

//   if (focusedOptions.tabBarVisible === false) {
//     return <View />;
//   }

//   if (focusedOptions.tabBarVisible === false) {
//     return null;
//   }

//   return (
//     <>
//       <View
//         style={[
//           {
//             width: DEVICE_WIDTH,
//             overflow: 'hidden',
//             position: 'absolute',
//             bottom: 0,
//             justifyContent: 'flex-end'
//           },
//           {
//             height: BOTTOM_TAB_HEIGHT + scale(40)
//           }
//         ]}>
//         <BottomTabBar {...{ focusedOptions, descriptors, navigation, state }} />
//       </View>
//     </>
//   );
// };

// export default TabBar;
