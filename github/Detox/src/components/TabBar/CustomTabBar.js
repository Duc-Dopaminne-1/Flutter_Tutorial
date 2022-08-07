import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import CustomTabIcon from './CustomTabIcon';

const CustomTabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom - 16,
        },
      ]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.itemContainer}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            activeOpacity={1}
            onPress={onPress}
            onLongPress={onLongPress}>
            <CustomTabIcon
              label={label}
              focused={isFocused}
              iconName={isFocused ? options.tabBarIconNameActive : options.tabBarIconName}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isFocused
                    ? options.tabBarActiveTintColor
                    : options.tabBarInactiveBackgroundColor,
                },
              ]}>
              {translate(label)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default React.memo(CustomTabBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.NEUTRAL_DIVIDER,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    ...FONTS.regular,
    fontSize: 10,
    marginBottom: 4,
  },
});
