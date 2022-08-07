import { colors, fonts, metrics } from '@/vars/index'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Animated,
  ScrollView,
} from 'react-native'

export type ATabViewProps = {
  scrollValue?: any
  goToPage?: any
  tabs?: any
  activeTab?: any
  style?: any
}

export default class ATabView2 extends React.PureComponent<ATabViewProps> {
  static defaultProps = {}

  onPressTab = (index: string | number) => () => {
    this.props.goToPage(index)
  }

  renderTab = () => {
    const { tabs, activeTab } = this.props

    return tabs.map((tab, i) => {
      return (
        <TouchableOpacity
          key={tab}
          onPress={this.onPressTab(i)}
          style={[styles.tab, activeTab === i && styles.activeBorderBottom]}
        >
          <Text
            style={[
              styles.tabBarText,
              activeTab === i && styles.activeTabBarText,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      )
    })
  }

  render() {
    const { style } = this.props

    return (
      <Animated.View style={[styles.container, style]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'always'}
        >
          {this.renderTab()}
        </ScrollView>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    height: metrics.tab_view_height,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  tab: {
    height: metrics.tab_view_height,
    width: metrics.screen_width / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBorderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary_blue,
  },
  tabBarText: {
    color: colors.text_light_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
    fontWeight: '600',
  },
  activeTabBarText: {
    opacity: 1,
    color: colors.primary_blue,
  },
})
