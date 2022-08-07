import { colors, images } from '@/vars'
import * as React from 'react'
import { Animated, FlatList, Keyboard, StyleSheet, View } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { ATabView } from '@/components/ATabView/ATabView'
import { AHeader3 } from '@/components/AHeader/AHeader3'
import {
  onDeleteTask,
  scrollTabViewTask,
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
  children: any
  placeholderSearch: string
  focusPlaceholderSearch: string
  onPressBack?: () => void
  onPressIcon?: () => void
} & DefaultProps

export type AScrollableTabViewState = Partial<{}> &
  Readonly<typeof initialState>

export class AScrollableTabViewTasks extends React.PureComponent<
  AScrollableTabViewProps,
  AScrollableTabViewState
> {
  _subscription: Subscription
  _eventSubscription: Subscription
  _updateKeywordSubscription: Subscription
  _onDeleteTaskSubscription: Subscription
  _flatList: React.RefObject<FlatList<any>> = React.createRef()
  _tabView: React.RefObject<ScrollableTabView> = React.createRef()
  state: AScrollableTabViewState = initialState

  componentDidMount() {
    this._subscription = scrollTabViewTask.subscribe(data => {
      const { flatListRef } = data

      this._flatList = flatListRef
    })

    this.fetchSearchKeyword()

    this._onDeleteTaskSubscription = onDeleteTask.subscribe(() => {
      this.onChangeText('')
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._eventSubscription && this._eventSubscription.unsubscribe()
    this._updateKeywordSubscription &&
      this._updateKeywordSubscription.unsubscribe()
    this._onDeleteTaskSubscription &&
      this._onDeleteTaskSubscription.unsubscribe()
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
      return SearchKeywordType.AssignedToMeTasks
    }
    if (indexTab === 1) {
      return SearchKeywordType.MyTasks
    }
    if (indexTab === 2) {
      return SearchKeywordType.AllTasks
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
    this.setState({
      indexTab: i,
    })
    Keyboard.dismiss()

    setTimeout(() => {
      this.onChangeText('')
    }, 0)
  }

  goToPage = (page: number) => {
    this._tabView && this._tabView.goToPage(page)
  }

  onPressIcon = () => {
    const { isFocus } = this.state
    const { onPressIcon } = this.props

    if (isFocus) {
      Keyboard.dismiss()
      setTimeout(() => {
        this.onChangeText('')
      }, 0)
      return
    }

    onPressIcon()
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

  renderHeader = () => {
    const {
      placeholderSearch,
      focusPlaceholderSearch,
      onPressBack,
    } = this.props
    const { keyword } = this.state
    return (
      <AHeader3
        placeholder={placeholderSearch}
        focusPlaceholder={focusPlaceholderSearch}
        value={keyword}
        icon={images.setting}
        onPressIcon={this.onPressIcon}
        onChangeText={this.onChangeText}
        onFocus={this.onFocus}
        hasBackIcon={true}
        onPressBack={onPressBack}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <ScrollableTabView
          ref={ref => (this._tabView = ref)}
          onChangeTab={this.onChangeTab}
          prerenderingSiblingsNumber={Infinity}
          renderTabBar={() => <ATabView />}
          contentProps={{
            keyboardShouldPersistTaps: 'always',
            scrollEnabled: false,
          }}
        >
          {this.props.children}
        </ScrollableTabView>
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
