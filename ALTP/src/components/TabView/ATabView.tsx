import { colors, fonts, metrics } from '@/vars/index'
import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView
} from 'react-native'

export type ATabViewProps = {
  scrollValue?: any
  goToPage?: any
  tabs?: any
  activeTab?: any
  style?: any
}

type ATabViewState = Readonly<{
  isSelect: boolean
}>

export function TabView(props: ATabViewProps) {
  const { style, activeTab, tabs } = props

  const [isSelect, setIsSelect] = useState(false)

  function onPressTab(index: string | number) {
    props.goToPage(index)
  }

  function renderTab() {
    props.refs(props)
    return tabs.map((tab, i) => {
      return (
        <View key={tab} pointerEvents={isSelect ? 'none' : 'auto'}>
          <TouchableOpacity
            key={tab}
            onPress={() => onPressTab(i)}
            style={[styles.tab, activeTab === i && styles.activeBorderBottom]}>
            <Text
              style={[
                styles.tabBarText,
                activeTab === i && styles.activeTabBarText
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  return (
    <Animated.View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps={'always'}>
        {renderTab()}
      </ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create<any>({
  container: {
    height: metrics.tab_view_height + 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light_white_gray,
    marginBottom: -10,
    paddingBottom: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  tab: {
    height: metrics.tab_view_height,
    justifyContent: 'center',
    width: metrics.screen_width / 2 - 15
  },
  activeBorderBottom: {
    backgroundColor: colors.white,
    borderRadius: 4,
    borderBottomWidth: 2,
    borderBottomColor: colors.back_button_ios_color
  },
  tabBarText: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPBold,
    color: colors.back_button_ios_color,
    alignSelf: 'center',
    opacity: 0.6
  },
  activeTabBarText: {
    opacity: 1
  }
})
