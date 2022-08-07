import I18n from '@/i18n'
import { colors, devices, fonts } from '@/vars'
import * as React from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { ProductInfoDetail } from './ProductInfoDetail'
import { ProductInfoTradeShipping } from '@/screens/ProductInfo/Components/ProductInfoTradeShipping'
import { ProductInfoActivity } from '@/screens/ProductInfo/Components/ProductInfoActivity'
import ATabView2 from '@/components/ATabView/ATabView2'

type Props = Readonly<{
  onChangeTab?: ({ i: number }) => void
}>

export class ProductInfoContentScrollable extends React.PureComponent<Props> {
  state = {
    page: devices.isIOS ? 1 : 0,
  }

  componentDidMount() {
    if (devices.isAndroid) {
      setTimeout(() => {
        this.setState({ page: 1 })
      }, 100)
    }
  }

  onChangeTab = props => {
    this.props.onChangeTab && this.props.onChangeTab(props)
    Keyboard.dismiss()
  }

  render() {
    return (
      <>
        <ScrollableTabView
          tabBarUnderlineStyle={styles.tabBarUnderline}
          tabBarActiveTextColor={colors.primary_blue}
          tabBarInactiveTextColor={colors.light_blue_grey}
          tabBarTextStyle={styles.tabBarText}
          contentProps={{
            keyboardShouldPersistTaps: 'always',
          }}
          style={styles.scrollableTabView}
          initialPage={0}
          onChangeTab={this.onChangeTab}
          renderTabBar={() => <ATabView2 />}
        >
          <ProductInfoActivity tabLabel={I18n.t('activity')} />
          <ProductInfoDetail tabLabel={I18n.t('productDetail')} />
        </ScrollableTabView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  scrollableTabView: {
    borderTopWidth: 0.6,
    borderBottomWidth: 0,
    borderColor: colors.pale_grey,
    paddingVertical: 0,
    backgroundColor: colors.white,
  },
  tabBarUnderline: {
    backgroundColor: colors.primary_blue,
    height: 2,
    paddingVertical: 0,
  },
  tabBarText: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
    marginBottom: -5,
    fontWeight: '600',
  },
})
