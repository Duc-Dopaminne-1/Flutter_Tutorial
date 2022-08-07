import { Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { colors, devices, images } from '@/vars'
import * as React from 'react'
import {
  AppState,
  AppStateStatus,
  FlatList,
  Keyboard,
  Linking,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import {
  scrollTabView,
  searchKeyword,
  SearchKeywordType,
} from '@/services/global'
import { Paging } from '@/paging'
import { EventCard } from '@/cards/Event/EventCard'
import { Booth, Event } from '@/models/global'
import { EventCloseToMe } from '@/screens/Event/component/EventCloseToMe'
import { EventData } from '@/services/globalEvent'
import LocationSwitch from 'react-native-location-switch'
import { safeLocation } from '@/shared/location'
import I18n from 'react-native-i18n'
import qs from 'qs'
import { email } from '@/common/constants/Email'
import { Connection } from '@/services/connection'
import { debounce } from 'lodash'

type Props = Readonly<{
  tab?: EventData
  type?: SearchKeywordType
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type State = Readonly<{
  denyLocation: boolean
  events: Realm.Collection<Event>
  loading: boolean
  selectedId: string
  change: Realm.CollectionChangeSet
  firstTimeLoadData: boolean
  appState: String
}>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class EventQuery extends React.PureComponent<Props, State> {
  _flatList: React.RefObject<FlatList<Event>> = React.createRef()
  _navListener = new NavigationService(this.props.navigation)
  _subscription: Subscription
  _updateKeywordSubscription: Subscription
  _results: Realm.Collection<Event> = [] as any
  _fuse: FuseService<Event> = new FuseService<Event>([] as any)
  _paging: Paging<Event> = new Paging<Event>([] as any)
  _eventResults: Realm.Collection<Event> = [] as any
  _after: string = null
  _currentRenderIndex: number = 0
  _keyword: string = ''
  _pagingSearch: Paging<Event> = new Paging<Event>([] as any)
  _afterSearch: string = null

  readonly state: State = {
    appState: AppState.currentState,
    denyLocation: false,
    events: [] as any,
    loading: true,
    selectedId: '',
    change: {
      deletions: [],
      insertions: [],
      modifications: [],
      newModifications: [],
      oldModifications: [],
    },
    firstTimeLoadData: true,
  }

  async componentDidMount() {
    this._navListener.didFocus(() => {
      StatusBar.setBarStyle('light-content', true)
      this._flatList.current && this._flatList.current.recordInteraction()
    })

    AppState.addEventListener('change', this.handleAppStateChange)
    this.fetchEvent()
    this.checkLocation()
    this.fetchSearchKeyword()
  }

  componentWillUnmount() {
    this._navListener.removeListener()
    this._subscription && this._subscription.unsubscribe()
    AppState.removeEventListener('change', this.handleAppStateChange)
    this._eventResults &&
      this._eventResults.removeAllListeners &&
      this._eventResults.removeAllListeners()
    this._updateKeywordSubscription &&
      this._updateKeywordSubscription.unsubscribe()
  }

  handleAppStateChange = (nextAppState: AppStateStatus) => {
    const { appState } = this.state
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      this.checkLocation()
    }
    this.setState({ appState: nextAppState })
  }

  checkLocation = () => {
    if (devices.isAndroid) {
      safeLocation.statusPermission()
    } else {
      LocationSwitch.isLocationEnabled(
        () => {
          this.setState({ denyLocation: false })
        },
        () => {
          this.setState({ denyLocation: true })
        }
      )
    }
  }

  fetchEvent = () => {
    const [subscription, result] = this.props.globalEventFactory.fetch({
      tab: this.props.tab,
      isReceiveChange: true,
    })

    this._eventResults = result

    this._subscription = subscription.subscribe(data => {
      if (data) {
        this._paging.update(data.col)

        const newEvents = this._paging.getDataFromStart(
          data.change.insertions.length === 0 ? this._currentRenderIndex : 0,
          30
        )

        this._after = this._paging.getLatestId(newEvents)
        this._currentRenderIndex = this._paging.currentIndex(this._after)

        this.resultUpdate(newEvents as any)
        this.searchUpdate(data.col, this.state.firstTimeLoadData)

        if (data.col.length >= 0 && this._keyword.trim().length === 0) {
          this.setState(
            {
              events: newEvents,
              change: data.change,
              loading: false,
              firstTimeLoadData: false,
            },
            () => {
              searchKeyword.next({ text: '', type: this.props.type })
            }
          )
        } else if (data.col.length >= 0 && this._keyword.trim().length !== 0) {
          this.onChangeText(this._keyword)
        }
      }
    })
  }

  fetchSearchKeyword = () => {
    this._updateKeywordSubscription = searchKeyword.subscribe(data => {
      if (data.type === this.props.type) {
        this.onChangeText(data.text)
      }
    })
  }

  resultUpdate = (events: Realm.Results<Event>) => {
    this._results = events
  }

  searchUpdate = (events, isFirstTime: boolean = false) => {
    if (isFirstTime) {
      this._fuse = new FuseService<Event>(events, {
        keys: ['description.name'] as any,
      })
    } else {
      this._fuse.update(events)
    }
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this._keyword = keyword
      this.setState({
        events: this._results,
      })

      return
    }

    this._keyword = keyword

    this.onSearch(keyword)
  }

  onSearch = debounce((keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())
    this._pagingSearch.update(result.data as any)
    const newEvents = this._pagingSearch.next(null)
    this._afterSearch = this._pagingSearch.getLatestId(newEvents)

    this.setState({
      events: newEvents as any,
    })
  }, 100)

  onScrollHandler = () => {
    const { events } = this.state

    if (!this._paging.isEnd(this._after) && this._keyword.trim().length === 0) {
      const nextEvents = this._paging.next(this._after)

      this._after = this._paging.getLatestId(nextEvents)
      this._currentRenderIndex = this._paging.currentIndex(this._after)

      const newEvents = events.concat(nextEvents)
      this.resultUpdate(newEvents as any)

      this.setState({
        events: newEvents as any,
      })
    } else if (
      !this._pagingSearch.isEnd(this._afterSearch) &&
      this._keyword.trim().length > 0
    ) {
      const nextEvents = this._pagingSearch.next(this._afterSearch)
      const newEvents = events.concat(nextEvents)

      this._afterSearch = this._pagingSearch.getLatestId(nextEvents)

      this.setState({
        events: newEvents as any,
      })
    }
  }

  onScroll = event => {
    scrollTabView.next({
      y: event.nativeEvent.contentOffset.y,
      type: 'Product',
      flatListRef: this._flatList,
    })
  }

  renderItem = ({ item }) => {
    if (!item) return null

    return <EventCard event={item} />
  }

  requestLocation = () => {
    if (devices.isAndroid) {
      safeLocation.checkPermission(true)
      setTimeout(() => {
        this.forceUpdate()
      }, 300)
    } else {
      LocationSwitch.enableLocationService(
        1000,
        true,
        () => {
          this.setState({ denyLocation: false })
        },
        () => {
          this.setState({ denyLocation: true })
        }
      )
    }
  }

  requestEmail = async () => {
    try {
      let url = `mailto:${email}`

      const query = qs.stringify({
        subject: 'Hello',
        body: I18n.t('likeToRequest'),
      })

      if (query.length) {
        url += `?${query}`
      }

      const canOpen = await Linking.canOpenURL(url)

      if (canOpen) {
        await Linking.openURL(url)
      } else {
        alert(`Can't open mail app. Please try again.`)
      }
    } catch (e) {
      alert(e)
    }
  }

  render() {
    const { events } = this.state

    if (events.length < 1) {
      // Trade show
      return (
        <EventCloseToMe
          requestLocation={this.requestEmail}
          icon={images.eventTrade}
          textButton={I18n.t('requestTradeShow')}
          textOne={I18n.t('noTradeShow')}
          textTwo={I18n.t('notDetectAnyTradeShow')}
          textThree={I18n.t('mostShowsAndEvents')}
        />
      )
    }

    return (
      <View style={styles.container}>
        <FlatList<Event>
          ref={this._flatList}
          data={events}
          extraData={events}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={this.renderItem}
          style={styles.list}
          onScrollBeginDrag={Keyboard.dismiss}
          keyboardShouldPersistTaps={'always'}
          onEndReached={this.onScrollHandler}
          onScroll={this.onScroll}
          bounces={false}
          onEndReachedThreshold={0.3}
          windowSize={61}
          initialNumToRender={30}
          maxToRenderPerBatch={30}
          updateCellsBatchingPeriod={0}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  list: {
    flex: 1,
  },
})
