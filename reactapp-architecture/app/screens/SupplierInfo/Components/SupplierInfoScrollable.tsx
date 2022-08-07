import * as React from 'react'
import I18n from '@/i18n'
import { SupplierInfoContact } from '@/screens/SupplierInfo/Components/SupplierInfoContact'
import { SupplierInfoDetail } from '@/screens/SupplierInfo/Components/SupplierInfoDetail'
import { colors, fonts } from '@/vars'
import { Keyboard, StyleSheet } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { SupplierInfoProduct } from './SupplierInfoProduct'
import { SupplierInfoComment } from './SupplierInfoComment'
import { Subscription } from 'rxjs'
import { onScrollToComment } from '@/services/global'

type Props = Readonly<{
  onChangeTab: (tab: number) => void
}>

type State = Readonly<{
  tab: number
}>

export class SupplierInfoScrollable extends React.PureComponent<Props, State> {
  _commentListRef: React.RefObject<SupplierInfoComment> = React.createRef()
  _subscription: Subscription

  static defaultProp = {
    onChangeTab: () => null,
  }

  state = {
    tab: 0,
  }

  componentDidMount() {
    this._subscription = onScrollToComment.subscribe(data => {
      const { type } = data
      if (type === 'supplier') {
        // TODO scroll to bottom
        this.setState({ tab: 0 })
      }
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
  }

  onChangeTab = ({ i }) => {
    Keyboard.dismiss()
    this.setState({ tab: i })
    this.props.onChangeTab(i)
  }

  render() {
    return (
      <ScrollableTabView
        page={this.state.tab}
        onChangeTab={this.onChangeTab}
        tabBarUnderlineStyle={styles.tabBarUnderline}
        tabBarActiveTextColor={colors.primary_blue}
        tabBarInactiveTextColor={colors.light_blue_grey}
        tabBarTextStyle={styles.tabBarText}
        initialPage={0}
        locked={true}
        contentProps={{
          keyboardShouldPersistTaps: 'always',
        }}
        style={styles.scrollableTabView}
      >
        <SupplierInfoComment tabLabel={I18n.t('activity')} />
        <SupplierInfoDetail tabLabel={I18n.t('details')} />
        <SupplierInfoContact tabLabel={I18n.t('contacts')} />
        <SupplierInfoProduct tabLabel={I18n.t('products')} />
      </ScrollableTabView>
    )
  }
}

const styles = StyleSheet.create({
  scrollableTabView: {
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
    fontWeight: '500',
    fontSize: fonts.size.l,
    marginBottom: -5,
  },
})
