import { colors, fonts, metrics } from '@/vars/index'
import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
} from 'react-native'
import { isVisibleTabBar } from '@/services/global'
import { Subscription } from 'rxjs'

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

export class ATabView extends React.PureComponent<
  ATabViewProps,
  ATabViewState
> {
  _selectMultiSubscription: Subscription

  static defaultProps = {}

  readonly state: ATabViewState = {
    isSelect: false,
  }

  componentDidMount(): void {
    this._selectMultiSubscription = isVisibleTabBar.subscribe(data => {
      if (data) {
        this.setState({ isSelect: false })
      } else {
        this.setState({ isSelect: true })
      }
    })
  }

  componentWillUnmount(): void {
    this._selectMultiSubscription && this._selectMultiSubscription.unsubscribe()
  }

  onPressTab = (index: string | number) => () => {
    this.props.goToPage(index)
  }

  renderTab = () => {
    const { tabs, activeTab } = this.props
    const { isSelect } = this.state
    return tabs.map((tab, i) => {
      return (
        <View key={tab} pointerEvents={isSelect ? 'none' : 'auto'}>
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
        </View>
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
    backgroundColor: colors.primary_blue,
  },
  tab: {
    height: metrics.tab_view_height,
    justifyContent: 'center',
    marginHorizontal: metrics.tab_view_margin,
  },
  activeBorderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
  },
  tabBarText: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPBold,
    color: colors.white,
    opacity: 0.6,
  },
  activeTabBarText: {
    opacity: 1,
  },
})
