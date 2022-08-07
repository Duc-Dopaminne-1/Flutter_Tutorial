import { colors, fonts, screenWidth } from '@/vars/index';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, ViewStyle, TextStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { NotificationInit } from '@/redux/notification/reducer';
import { isIOS } from '@/shared/devices';

export type ATabViewProps = {
  scrollValue?: any;
  goToPage?: any;
  tabs?: any;
  activeTab?: any;
  style?: any;
  initTab?: number;
  activeTabStyle?: ViewStyle;
  inActiveTabStyle?: ViewStyle;
  tabBarTextStyle?: TextStyle;
  isDisable?: boolean;
  isFromBid?: boolean;
};

// let indexTab: string | number = -1;

export function TabView(props: ATabViewProps) {
  const { style, activeTab, tabs, initTab = 0, goToPage, activeTabStyle, inActiveTabStyle, tabBarTextStyle, isDisable, isFromBid } = props;
  const statusDeeplink = useSelector((state: NotificationInit) => {
    return state.notification.isCountDeeplink;
  });

  useEffect(() => {
    if (isFromBid && statusDeeplink) {
      goToPage(1);
    }
  }, [statusDeeplink]);

  useEffect(() => {
    setTimeout(() => {
      goToPage(initTab);
    }, 500);
  }, [initTab]);

  function onPressTab(index: string | number) {
    if (isDisable) {
      return;
    }
    // indexTab = index;
    goToPage(index);
  }

  function renderTab() {
    return tabs.map((tab, i) => {
      return (
        <View key={tab} style={[styles.inActiveTab, inActiveTabStyle, activeTab === i && [styles.activeTab, activeTabStyle]]}>
          <Pressable key={tab} onPress={() => onPressTab(i)}>
            <Text style={[styles.tabBarText, tabBarTextStyle, activeTab === i && styles.activeTabBarText]}>{tab}</Text>
          </Pressable>
        </View>
      );
    });
  }

  return (
    <View style={styles.mainContent}>
      <View style={styles.borderTabbar} />
      <View style={[styles.container, style]}>
        <ScrollView
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="always"
          horizontal
        >
          {renderTab()}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    height: 40,
    marginHorizontal: 24,
  } as ViewStyle,

  borderTabbar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.gray_400,
    backgroundColor: colors.white,
  } as ViewStyle,

  container: {
    // borderWidth: 1,
    // borderRadius: 10,
    // borderColor: colors.bg_tab,
    flex: 1,
  } as ViewStyle,

  activeTab: {
    height: '100%',
    width: screenWidth / 2 - 22,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.red_600,
    marginLeft: -1,
  } as ViewStyle,

  inActiveTab: {
    height: 42,
    width: screenWidth / 2 - 24,
    justifyContent: 'center',
    borderRadius: 9,
  },

  activeTabBarText: {
    color: colors.white,
    fontWeight: isIOS ? '600' : 'bold',
  } as TextStyle,

  tabBarText: {
    alignSelf: 'center',
    color: colors.gray_600,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s16,
  },
});
