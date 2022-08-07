import { colors, fonts, WIDTH } from '@constants/vars';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Animated, ScrollView } from 'react-native';
import styles from './styles';
import { CustomText } from '../CustomText';

export type ATabViewProps = {
  scrollValue?: any;
  goToPage?: any;
  tabs?: any;
  activeTab?: any;
  style?: any;
};

type ATabViewState = Readonly<{
  isSelect: boolean;
}>;

export function TabView(props: ATabViewProps) {
  const { style, activeTab, tabs } = props;

  const [isSelect, setIsSelect] = useState(false);

  function onPressTab(index: string | number) {
    props.goToPage(index);
  }

  function renderTab() {
    // props.refs(props)
    return tabs.map((tab, i) => {
      return (
        <View key={i} pointerEvents={isSelect ? 'none' : 'auto'}>
          <TouchableOpacity
            key={tab}
            onPress={() => onPressTab(i)}
            style={[styles.tab, activeTab === i && styles.activeBorderBottom, tabs.length > 2 ? styles.itemHeight : {}]}
          >
            <CustomText numberOfLines={1} style={[styles.tabBarText, activeTab === i && styles.activeTabBarText]} text={tab} />
          </TouchableOpacity>
        </View>
      );
    });
  }

  return (
    <Animated.View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps={'always'}
        alwaysBounceVertical={true}
      >
        {renderTab()}
      </ScrollView>
    </Animated.View>
  );
}
