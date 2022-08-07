import { colors, fonts, metrics } from '@/vars/index'
import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Keyboard,
} from 'react-native'
import I18n from '@/i18n'
import { isIpad } from '@/shared/devices'
import { flexIpadProduct } from '@/common/constants/FlexIpadProduct'

export type ATabViewProps = {
  onChangeTab: any
  reachedTab: boolean
  tabs: string[]
}

export default class ATabView3 extends React.PureComponent<ATabViewProps> {
  static defaultProps = {}

  state = {
    activeTab: 0,
  }

  onPressTab = (index: string | number) => () => {
    const { activeTab } = this.state
    const { onChangeTab } = this.props

    if (activeTab === index) return

    Keyboard.dismiss()

    this.setState({
      activeTab: index,
    })

    onChangeTab && onChangeTab(index)
  }

  renderTab = (tagName, index) => {
    const { activeTab } = this.state
    // const width = metrics.screen_width / 2
    // const widthIpadDetail =
    //   (metrics.screen_width * (flexIpadProduct / (flexIpadProduct + 1))) / 2

    return (
      <TouchableOpacity
        key={tagName}
        onPress={this.onPressTab(index)}
        style={[
          styles.tab,
          activeTab === index && styles.activeBorderBottom,
          // { width: isIpad() ? widthIpadDetail : width },
        ]}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.tabBarText,
            activeTab === index && styles.activeTabBarText,
          ]}
        >
          {tagName}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { reachedTab, tabs } = this.props

    return (
      <Animated.View
        style={[styles.container, reachedTab && styles.marginTopCustom]}
      >
        {this.renderTab(tabs[0], 0)}
        {this.renderTab(tabs[1], 1)}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    height: metrics.tab_view_height,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.6,
    borderBottomWidth: 0,
    borderColor: colors.pale_grey,
    paddingVertical: 0,
    backgroundColor: colors.white,
  },
  marginTopCustom: {
    marginTop: metrics.tab_view_3_height,
  },
  tab: {
    width: '50%',
    height: metrics.tab_view_height,
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
