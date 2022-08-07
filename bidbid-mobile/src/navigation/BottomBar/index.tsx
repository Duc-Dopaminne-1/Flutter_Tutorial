import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/vars';
import BottomBarIcon from './component/BottomBarIcon';

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        return (
          <BottomBarIcon
            key={index}
            navigation={navigation}
            route={route}
            label={label}
            options={options}
            isFocused={isFocused}
            index={index}
          />
        );
      })}
    </View>
  );
}

export default memo(MyTabBar);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    elevation: 4,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
});
