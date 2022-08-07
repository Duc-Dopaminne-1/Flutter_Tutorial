import { colors } from '@/vars'
import * as React from 'react'
import { Animated, FlatList, Keyboard, StyleSheet, View } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { ATabView } from '@/components/ATabView/ATabView'
import { AHeader5 } from '@/components/AHeader/AHeader5'
import {
  scrollTabView,
  searchKeyword,
  SearchKeywordType,
} from '@/services/global'
import { Subscription } from 'rxjs'

// init state
const initialState = {
  indexTab: 0,
  keyword: '',
  isFocus: false,
  marginTabView: new Animated.Value(0),
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type AScrollableTabViewProps = {
  onPressBack?: () => void
  onPressCreate?: () => void
  children: any
  placeholderSearch: string
  focusPlaceholderSearch: string
} & DefaultProps

export type AScrollableTabViewState = Partial<{}> &
  Readonly<typeof initialState>

export class AScrollableTabViewEvent extends React.PureComponent<
  AScrollableTabViewProps,
  AScrollableTabViewState
> {
  _subscription: Subscription
  _updateKeywordSubscription: Subscription
  // _onDeleteProductSubscription: Subscription
  _flatList: React.RefObject<FlatList<any>> = React.createRef()

  state: AScrollableTabViewState = initialState

  componentDidMount() {
    this._subscription = scrollTabView.subscribe(data => {
      const { y, flatListRef } = data

      this._flatList = flatListRef
      this.scrollState(y)
    })

    this.fetchSearchKeyword()

    // this._onDeleteProductSubscription = onDeleteProduct.subscribe(() => {
    //   this.onChangeText('')
    // })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._updateKeywordSubscription &&
      this._updateKeywordSubscription.unsubscribe()
    // this._onDeleteProductSubscription &&
    //   this._onDeleteProductSubscription.unsubscribe()
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
    const { indexTab } = this.state

    if (indexTab === 0) {
      return SearchKeywordType.FutureEvent
    }
    if (indexTab === 1) {
      return SearchKeywordType.CloseToMe
    }
    if (indexTab === 2) {
      return SearchKeywordType.PastEvents
    }

    return null
  }

  onChangeText = (text: string) => {
    const type = this.searchKeywordType

    if (type === null) return

    this.setState({
      keyword: text,
    })

    searchKeyword.next({
      text,
      type,
    })
  }

  onChangeTab = ({ i }) => {
    Keyboard.dismiss()
    this.onChangeText('')
    this.setState({
      indexTab: i,
    })
  }

  onPressCancel = () => {
    const { isFocus } = this.state

    if (isFocus) {
      Keyboard.dismiss()
      setTimeout(() => {
        this.onChangeText('')
      }, 0)
      return
    }
  }

  onFocus = (isFocus: boolean) => {
    this.setState({
      isFocus,
    })

    if (isFocus) {
      const params = {
        offset: 0,
        animated: true,
      }

      this._flatList.current && this._flatList.current.scrollToOffset(params)
    }
  }

  scrollState = y => {
    if (y > 30) {
      // move tabView up to hide
      Animated.timing(this.state.marginTabView, {
        toValue: -60,
        duration: 80,
      }).start()
    } else {
      // move tabView down to show it
      Animated.timing(this.state.marginTabView, {
        toValue: 0,
        duration: 80,
      }).start()
    }
  }

  renderContent = () => {
    const { children } = this.props

    return (
      <ScrollableTabView
        onChangeTab={this.onChangeTab}
        prerenderingSiblingsNumber={0}
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
    const {
      placeholderSearch,
      focusPlaceholderSearch,
      onPressBack,
    } = this.props
    const { keyword } = this.state

    return (
      <View style={styles.container}>
        <AHeader5
          placeholder={placeholderSearch}
          focusPlaceholder={focusPlaceholderSearch}
          hasBackIcon={true}
          value={keyword}
          onPressBack={onPressBack}
          onPressCancel={this.onPressCancel}
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
