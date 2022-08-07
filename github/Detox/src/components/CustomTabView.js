import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TabView} from 'react-native-tab-view';

import {CONSTANTS} from '../assets/constants';
import {IMAGES} from '../assets/images';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {normal} from '../assets/theme/metric';
import {SCREEN_SIZE} from '../utils/ImageUtil';

const tabIndicatorRatio = 343 / 17;
export const tabIndicatorWidth = SCREEN_SIZE.WIDTH - normal * 2;
export const tabIndicatorHight = tabIndicatorWidth / tabIndicatorRatio;
export const tabItemWidth = (SCREEN_SIZE.WIDTH - 16 * 2) / 2;
export const tabWidth = SCREEN_SIZE.WIDTH - 16 * 2;

const styles = StyleSheet.create({
  tabBar: {
    ...HELPERS.rowMain,
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
    padding: 16,
    width: SCREEN_SIZE.WIDTH / 2,
  },
  tabBarButton: {
    ...HELPERS.rowMain,
    width: tabWidth,
    marginHorizontal: 16,
  },
  tabItemButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 5,
    width: tabItemWidth,
  },
  tabItemEnabled: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    width: tabItemWidth,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY_A20,
  },
  tabTitleEnabled: {
    fontSize: 14,
    color: COLORS.PRIMARY_A100,
    ...FONTS.bold,
  },
  tabTitleDisabled: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_40,
  },
  statusIcon: {
    alignItems: 'center',
    width: tabIndicatorWidth,
    height: tabIndicatorHight,
  },
  enabledTabOrange: {
    backgroundColor: COLORS.TRANSPARENT,
    borderRadius: 0,
    borderBottomColor: COLORS.PRIMARY_A100,
    borderBottomWidth: 2,
  },
});
export const TAB_TYPE = {
  DEFAULT: 0,
  BUTTONS: 1,
  PRIMARY_ORANGE: 2, // TODO: tab with new style orange, this color should be implement theme provider
};

const CustomTabView = ({
  defaultIndex,
  routes,
  renderScene,
  customTabBar,
  itemsCount,
  sceneContainerStyle,
  onIndexChange,
  isLazy = false,
  tabBarStyle = {},
  enableTabBarCustomStyle = {},
  childComponent,
  type = TAB_TYPE.DEFAULT,
}: {}) => {
  const initialState = {
    index: defaultIndex ?? 0,
    routes: routes,
  };

  const [state, setState] = React.useState(initialState);

  function selectTab(index) {
    setState({index, routes});
  }
  const handleIndexChange = index => {
    selectTab(index);
    onIndexChange && onIndexChange({index, key: routes[index].key});
  };

  const getTabBarTitle = (route, tabIndex) => {
    return itemsCount ? `${route.title} (${itemsCount[tabIndex]})` : route.title;
  };

  const renderTabBar = props => {
    if (customTabBar) {
      return customTabBar(props);
    }
    const renderTabButtons = props.navigationState.routes.map((route, tabIndex) => {
      if (type === TAB_TYPE.BUTTONS || type === TAB_TYPE.PRIMARY_ORANGE) {
        let enabledTabItem = styles.tabItemEnabled;
        let enabledTabTitle = styles.tabTitleEnabled;
        let disabledTabTitle = styles.tabTitleDisabled;
        if (type === TAB_TYPE.PRIMARY_ORANGE) {
          enabledTabItem = {
            ...enabledTabItem,
            ...styles.enabledTabOrange,
            ...enableTabBarCustomStyle,
          };
          enabledTabTitle = {...enabledTabTitle, color: COLORS.PRIMARY_A100};
          disabledTabTitle = {...disabledTabTitle, color: COLORS.BLACK_33};
        }
        return (
          <TouchableOpacity
            hitSlop={CONSTANTS.HIT_SLOP_VERTICAL}
            key={tabIndex}
            style={tabIndex === state.index ? enabledTabItem : styles.tabItemButton}
            onPress={() => handleIndexChange(tabIndex)}>
            <Text style={tabIndex === state.index ? enabledTabTitle : disabledTabTitle}>
              {getTabBarTitle(route, tabIndex)}
            </Text>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          hitSlop={CONSTANTS.HIT_SLOP_VERTICAL}
          key={tabIndex}
          style={styles.tabItem}
          onPress={() => selectTab(tabIndex)}>
          <Text style={tabIndex === state.index ? styles.tabTitleEnabled : styles.tabTitleDisabled}>
            {getTabBarTitle(route, tabIndex)}
          </Text>
        </TouchableOpacity>
      );
    });
    if (type === TAB_TYPE.BUTTONS) {
      return (
        <>
          <ImageBackground
            resizeMode="stretch"
            source={IMAGES.IMAGE_BACKGROUND_TAB}
            style={[styles.tabBarButton, tabBarStyle]}>
            {renderTabButtons}
          </ImageBackground>
          {childComponent}
        </>
      );
    } else if (type === TAB_TYPE.PRIMARY_ORANGE) {
      return (
        <>
          <View style={[styles.tabBarButton, tabBarStyle]}>{renderTabButtons}</View>
          {childComponent}
        </>
      );
    } else {
      return (
        <>
          <View style={styles.tabBar}>{renderTabButtons}</View>
          <View style={styles.tabBar}>
            <Image
              source={state.index === 0 ? IMAGES.IC_TAB_LEFT_ENABLED : IMAGES.IC_TAB_RIGHT_ENABLED}
              style={styles.statusIcon}
            />
          </View>
        </>
      );
    }
  };
  return (
    <TabView
      sceneContainerStyle={sceneContainerStyle}
      navigationState={state}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={handleIndexChange}
      swipeEnabled={false}
      lazy={isLazy}
    />
  );
};

export default CustomTabView;
