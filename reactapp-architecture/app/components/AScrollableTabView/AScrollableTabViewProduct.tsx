import { colors, images } from '@/vars'
import * as React from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { ATabView } from '@/components/ATabView/ATabView'
import { AHeader3 } from '@/components/AHeader/AHeader3'
import {
  onDeleteProduct,
  searchKeyword,
  SearchKeywordType,
} from '@/services/global'
import { Subscription } from 'rxjs'

// init state
const initialState = {
  indexTab: 0,
  keyword: '',
  isFocus: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type AScrollableTabViewProps = {
  onPressCreate?: () => void
  children: any
  placeholderSearch: string
  focusPlaceholderSearch: string
} & DefaultProps

export type AScrollableTabViewState = Partial<{}> &
  Readonly<typeof initialState>

export class AScrollableTabViewProduct extends React.PureComponent<
  AScrollableTabViewProps,
  AScrollableTabViewState
> {
  _subscription: Subscription
  _eventSubscription: Subscription
  _updateKeywordSubscription: Subscription
  _onDeleteProductSubscription: Subscription

  state: AScrollableTabViewState = initialState

  componentDidMount() {
    this.fetchSearchKeyword()

    this._onDeleteProductSubscription = onDeleteProduct.subscribe(() => {
      this.onChangeText('')
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._eventSubscription && this._eventSubscription.unsubscribe()
    this._updateKeywordSubscription &&
      this._updateKeywordSubscription.unsubscribe()
    this._onDeleteProductSubscription &&
      this._onDeleteProductSubscription.unsubscribe()
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
      return SearchKeywordType.MyProduct
    }
    if (indexTab === 1) {
      return SearchKeywordType.AllProduct
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
    this.setState({
      isFocus,
    })
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
