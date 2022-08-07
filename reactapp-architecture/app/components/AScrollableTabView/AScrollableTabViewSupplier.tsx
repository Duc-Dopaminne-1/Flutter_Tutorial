import { colors, devices, images } from '@/vars'
import * as React from 'react'
import { Animated, Keyboard, StyleSheet, View } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { ATabView } from '@/components/ATabView/ATabView'
import { AHeader3 } from '@/components/AHeader/AHeader3'
import {
  onDeleteSupplier,
  searchKeyword,
  SearchKeywordType,
} from '@/services/global'
import { Subscription } from 'rxjs'
import { eventStore } from '@/stores/eventStore'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { supplierStore, SupplierStoreRef } from '@/stores/supplierStore'
import { createSupplierNavigation } from '@/navigation/createSupplierNavigation'

// init state
const initialState = {
  indexTab: 0,
  keyword: '',
  isFocus: false,
  marginTabView: new Animated.Value(0),
  haveEvent: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type AScrollableTabViewProps = {
  onPressCreate: () => void
  children: any
  placeholderSearch: string
  focusPlaceholderSearch: string
} & DefaultProps

export type AScrollableTabViewState = Partial<{}> &
  Readonly<typeof initialState>

export class AScrollableTabViewSupplier extends React.PureComponent<
  AScrollableTabViewProps,
  AScrollableTabViewState
> {
  _subscription: Subscription
  _eventSubscription: Subscription
  _updateKeywordSubscription: Subscription
  _onDeleteSupplierSubscription: Subscription

  state: AScrollableTabViewState = initialState

  componentDidMount() {
    this.fetchSearchKeyword()
    this.checkEvent()

    this._onDeleteSupplierSubscription = onDeleteSupplier.subscribe(() => {
      this.onChangeText(this.state.keyword)
      createSupplierNavigation.clear()
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._eventSubscription && this._eventSubscription.unsubscribe()
    this._updateKeywordSubscription &&
      this._updateKeywordSubscription.unsubscribe()
    this._onDeleteSupplierSubscription &&
      this._onDeleteSupplierSubscription.unsubscribe()
  }

  checkEvent = () => {
    this.setState({
      haveEvent: !!eventStore.currentEvent,
    })

    this._eventSubscription = eventStore.updateEventSub.subscribe(data => {
      this.setState({
        haveEvent: !!data,
      })
    })
  }

  fetchSearchKeyword = () => {
    this._updateKeywordSubscription = searchKeyword.subscribe(data => {
      const type = this.searchKeywordType

      if (type === data.type) {
        this.setState({
          keyword: data.text,
        })
      }
    })
  }

  get searchKeywordType() {
    const { indexTab, haveEvent } = this.state

    if (haveEvent) {
      if (indexTab === 0) {
        return SearchKeywordType.Exhibitors
      }
      if (indexTab === 1) {
        return SearchKeywordType.MySupplier
      }
      if (indexTab === 2) {
        return SearchKeywordType.AllSupplier
      }
    } else {
      if (indexTab === 0) {
        return SearchKeywordType.MySupplier
      }
      if (indexTab === 1) {
        return SearchKeywordType.AllSupplier
      }
    }

    return null
  }

  onChangeText = (text: string) => {
    const type = this.searchKeywordType

    if (type === null) return

    this.setState({
      keyword: text,
    })

    setTimeout(() => {
      searchKeyword.next({
        text,
        type,
      })
    }, 0)
  }

  onChangeTab = ({ i }) => {
    Keyboard.dismiss()
    this.onChangeText('')
    this.setState({
      indexTab: i,
    })
  }

  onPressIcon = () => {
    const { isFocus } = this.state
    const { onPressCreate } = this.props

    if (isFocus) {
      Keyboard.dismiss()
      setTimeout(() => {
        this.onChangeText('')
      }, 0)
      return
    }

    onPressCreate()
  }

  onFocus = (isFocus: boolean) => {
    if (devices.isAndroid && isFocus) {
      AndroidKeyboardAdjust.setAdjustPan()
    }

    this.setState({
      isFocus,
    })
  }

  renderContent = () => {
    const { children } = this.props

    return (
      <ScrollableTabView
        ref={ref => {
          supplierStore.setRef(SupplierStoreRef.TabView, ref)
        }}
        onChangeTab={this.onChangeTab}
        /**
         * this need to be Infinity to update exhibitors list when user save
         * supplier from exhibitors list
         */
        prerenderingSiblingsNumber={Infinity}
        renderTabBar={() => <ATabView />}
        contentProps={{
          keyboardShouldPersistTaps: 'always',
          scrollEnabled: false,
        }}
      >
        {children}
      </ScrollableTabView>
    )
  }

  render() {
    const { placeholderSearch, focusPlaceholderSearch } = this.props
    const { keyword } = this.state

    return (
      <View style={styles.container}>
        <AHeader3
          placeholder={placeholderSearch}
          focusPlaceholder={focusPlaceholderSearch}
          value={keyword}
          icon={images.add}
          onPressIcon={this.onPressIcon}
          onChangeText={this.onChangeText}
          onFocus={this.onFocus}
        />

        {this.renderContent()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapTabBar: {
    flex: 1,
    zIndex: -99,
  },
})
