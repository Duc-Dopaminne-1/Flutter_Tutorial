import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {TabBar} from 'react-native-tab-view';

import {IMAGES} from '../assets/images';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import CustomTabView from './CustomTabView';

const INDICATOR_RATIO = 172 / 17;
export const TAB_BUTTON_HEIGHT = 64;
const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: COLORS.BACKGROUND,
    elevation: 0,
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0,
  },
  indicator: {
    backgroundColor: COLORS.PRIMARY_A100,
    elevation: 0,
  },
  label: {
    ...FONTS.semiBold,
  },
  tabTitleEnabled: {
    ...FONTS.semiBold,
    fontSize: 16,
    color: COLORS.TEXT_DARK_10,
  },
  indicatorContainer: {
    ...HELPERS.fill,
  },
  iconColorActive: {
    ...HELPERS.fill,
    tintColor: COLORS.PRIMARY_A100,
  },
  iconColorDeactivate: {
    ...HELPERS.fill,
    tintColor: COLORS.TEXT_DARK_40,
  },
});

const generateIndicator = (routes, currentTabIndex) => {
  const lastIndex = routes.length - 1;
  const height = Dimensions.get('screen').width / routes.length / INDICATOR_RATIO;
  return routes.map((route, index) => {
    const imageStyle =
      index === currentTabIndex ? styles.iconColorActive : styles.iconColorDeactivate;
    let imageSource = IMAGES.IC_TAB_CENTER;
    if (index === 0) {
      imageSource = IMAGES.IC_TAB_START;
    } else if (index === lastIndex) {
      imageSource = IMAGES.IC_TAB_END;
    }
    return (
      <Image
        key={route.key}
        resizeMode="stretch"
        style={[imageStyle, {height}]}
        source={imageSource}
      />
    );
  });
};

const renderLabel = ({route}) => {
  return (
    <View>
      <Text style={styles.tabTitleEnabled}>{route.title}</Text>
    </View>
  );
};

const NewTabBar = ({routes, renderScene, sceneContainerStyle}) => {
  const renderIndicator = props => {
    const currentIndex = props.navigationState.index;
    return (
      <View style={styles.indicatorContainer}>
        <View style={HELPERS.fill} />
        <View style={HELPERS.row}>{generateIndicator(routes, currentIndex)}</View>
      </View>
    );
  };

  const renderTabBar = props => {
    const tabStyle = {
      width: Dimensions.get('screen').width / routes.length,
      elevation: 0,
      height: TAB_BUTTON_HEIGHT,
    };
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={tabStyle}
        labelStyle={styles.label}
        activeColor={COLORS.PRIMARY_A100}
        inactiveColor={COLORS.TEXT_DARK_40}
        renderLabel={renderLabel}
        renderIndicator={renderIndicator}
      />
    );
  };

  return (
    <CustomTabView
      sceneContainerStyle={[sceneContainerStyle]}
      routes={routes}
      renderScene={renderScene}
      customTabBar={renderTabBar}
      isLazy={true}
    />
  );
};

export default NewTabBar;
