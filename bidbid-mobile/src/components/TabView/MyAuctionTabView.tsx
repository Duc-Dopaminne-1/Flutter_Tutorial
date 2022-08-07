import { colors, fonts, screenWidth } from '@/vars/index';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, ViewStyle, TextStyle } from 'react-native';

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
};

export function MyAuctionTabView(props: ATabViewProps) {
  const { style, activeTab, tabs, goToPage, activeTabStyle, inActiveTabStyle, tabBarTextStyle, isDisable } = props;

  function onPressTab(index: string | number) {
    if (isDisable) {
      return;
    }
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
  );
}

const styles = StyleSheet.create<any>({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.bg_tab,
    marginHorizontal: 24,
    backgroundColor: colors.white,
  },
  activeTab: {
    width: screenWidth / 2 - 24,
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: colors.bg_tab,
    paddingVertical: 10,
    marginLeft: -1,
  },
  inActiveTab: {
    width: screenWidth / 2 - 24,
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingVertical: 10,
  },
  activeTabBarText: {
    color: colors.white,
  },
  tabBarText: {
    alignSelf: 'center',
    color: colors.text_tab,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s15,
  },
});
