import * as React from 'react'
import { SampleQueryRow, SampleActionType } from './Components/SampleQueryRow'
import I18n from '@/i18n'
import { Sample, Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import { colors, metrics, fonts, images } from '@/vars'
import {
  FlatList,
  Keyboard,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import {
  scrollTabViewSample,
  searchKeyword,
  searchKeywordDashboard,
  SearchKeywordType,
} from '@/services/global'
import { Paging } from '@/paging'
import { debounce, isEmpty } from 'lodash'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { isIphoneX } from '@/shared/devices'
import { SampleQueryPlaceholder } from './Components/SampleQueryPlaceholder'
import { APlaceholderMultiSearch } from '@/components/APlaceHolder/APlaceholderMultiSearch'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'

type Props = Readonly<{
  type?: SearchKeywordType
  query?: string
  onAction: (sample: Sample, type: SampleActionType) => void
  onViewAll?: () => void
  disableSwipeActions?: boolean
  limited?: boolean
  initialLimit?: number
  isComponent?: boolean
  product?: Product
}> &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  samples: Realm.Collection<Sample>
  loading: boolean
}>

@DelayRender({ delay: 100 })
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class SampleQuery extends React.PureComponent<Props, State> {
  _flatList: React.RefObject<FlatList<Sample>> = React.createRef()
  _fuse: FuseService<Sample> = new FuseService<Sample>([] as any)
  _results: Realm.Results<Sample> = [] as any
  _subscription: Subscription
  _subSubscription: Subscription
  _updateKeywordSubscription: Subscription
  _paging: Paging<Sample> = new Paging<Sample>([] as any)
  _after: string = null
  _currentRenderIndex: number = 0
  _keyword: string = ''
  _pagingSearch: Paging<Sample> = new Paging<Sample>([] as any)
  _afterSearch: string = null
  _firstTimeLoadData: boolean = true
  _rows = {}
  _openedRowId: string = null
  _isShowEmpty = false

  static readonly defaultProps = {
    onViewAll: () => null,
  }

  state: State = {
    samples: [] as any,
    loading: true,
  }

  componentDidMount() {
    this.fetchSamples()
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._subSubscription && this._subSubscription.unsubscribe()
    this._results &&
      this._results.removeAllListeners &&
      this._results.removeAllListeners()
    this._updateKeywordSubscription &&
      this._updateKeywordSubscription.unsubscribe()
  }

  componentDidUpdate(prevPros) {
    if (prevPros.query !== this.props.query) {
      this._after = null
      this._currentRenderIndex = 0
      this._keyword = ''
      this._afterSearch = null
      this.fetchSamples()
    }
  }

  fetchSamples = () => {
    const { sampleFactory, query, limited, initialLimit } = this.props
    if (!sampleFactory) return

    const [subscription, results] = sampleFactory.fetch({
      query,
      isReceiveChange: true,
    })

    this._results &&
      this._results.removeAllListeners &&
      this._results.removeAllListeners()
    this._subscription && this._subscription.unsubscribe()
    this._results = results
    this._subscription = subscription.subscribe(samples => {
      this._paging.update(samples.col)

      const limit = limited && initialLimit > 0 ? initialLimit : 30

      const newSamples = this._paging.getDataFromStart(
        samples.change.insertions.length === 0 ? this._currentRenderIndex : 0,
        limit
      )

      this._after = this._paging.getLatestId(newSamples)
      this._currentRenderIndex = this._paging.currentIndex(this._after)

      this.resultUpdate(newSamples)
      this.searchUpdate(samples.col, this._firstTimeLoadData)

      if (samples.col.length >= 0 && this._keyword.trim().length === 0) {
        this._keyword = ''
        this.setState(
          {
            samples: newSamples,
            loading: false,
          },
          () => {
            this._firstTimeLoadData = false
            searchKeyword.next({ text: '', type: this.props.type })
          }
        )
      } else if (samples.col.length >= 0 && this._keyword.trim().length !== 0) {
        this.onChangeText(this._keyword)
      }
    })

    this._subSubscription && this._subSubscription.unsubscribe()
    this._subSubscription = sampleFactory.subject().subscribe(value => {
      if (value === Realm.Sync.SubscriptionState.Complete) {
        this.setState({ loading: false })
      }
    })
  }

  fetchSearchKeyword = () => {
    const { fromMultiSearch } = this.props

    if (fromMultiSearch) {
      this._updateKeywordSubscription = searchKeywordDashboard.subscribe(
        data => {
          this.onChangeText(data.text)
        }
      )
    } else {
      this._updateKeywordSubscription = searchKeyword.subscribe(data => {
        if (data.type === this.props.type) {
          this.onChangeText(data.text)
        }
      })
    }
  }

  resultUpdate = samples => {
    if (!samples.removeAllListeners) {
      this._results &&
        this._results.removeAllListeners &&
        this._results.removeAllListeners()
    }

    this._results = samples
  }

  searchUpdate = (samples, isFirstTime: boolean = false) => {
    if (isFirstTime) {
      this._fuse = new FuseService<Sample>(samples, {
        keys: [
          'name',
          'reference',
          'description',
          'assignee.firstName',
          'assignee.lastName',
          'createdBy.name',
          'supplier.name',
        ] as any,
      })
      this.fetchSearchKeyword()
    } else {
      this._fuse.update(samples)
    }
  }

  onPressCard = debounce((item: Sample, _index: number) => {
    const { navigation } = this.props
    navigation.navigate('SampleInfoScreen', { sample: item, wasCreated: true })
  }, 250)

  onScrollHandler = (force: boolean = false) => {
    const { samples } = this.state
    const { isComponent } = this.props

    if (isComponent && !force) {
      return
    }

    if (!this._paging.isEnd(this._after) && this._keyword.trim().length === 0) {
      const nextSamples = this._paging.next(this._after)

      this._after = this._paging.getLatestId(nextSamples)
      this._currentRenderIndex = this._paging.currentIndex(this._after)

      const newSamples = samples.concat(nextSamples)
      this.resultUpdate(newSamples)

      this.setState({ samples: newSamples as any })
    } else if (
      !this._pagingSearch.isEnd(this._afterSearch) &&
      this._keyword.trim().length > 0
    ) {
      const nextSamples = this._pagingSearch.next(this._afterSearch)
      const newSamples = samples.concat(nextSamples)

      this._afterSearch = this._paging.getLatestId(nextSamples)

      this.setState({
        samples: newSamples as any,
      })
    }
  }

  onScroll = (event: any) => {
    scrollTabViewSample.next({
      y: event.nativeEvent.contentOffset.y,
      type: 'Sample',
      flatListRef: this._flatList,
    })
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this._keyword = keyword
      this._isShowEmpty = true
      this.setState({
        samples: this._results,
      })
      return
    }

    this._keyword = keyword
    this.onSearch(keyword)
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this._isShowEmpty = true
      return
    }

    const result = this._fuse.search(keyword.trim())
    this._isShowEmpty = result.data.length <= 0
    this._pagingSearch.update(result.data as any)
    const newSamples = this._pagingSearch.next(null)
    this._afterSearch = this._pagingSearch.getLatestId(newSamples)

    this.setState({ samples: newSamples })
  }

  onCreateSample = () => {
    const { product, navigation } = this.props
    navigation.navigate('CreateSamplePicker', { product })
  }

  renderEmptyContent = () => {
    if (!isEmpty(this.state.samples) || !this.props.isComponent) {
      return null
    }
    return (
      <View style={styles.emptyContainer}>
        <Image style={styles.image} source={images.sample} />
        <Text style={styles.sample}>{I18n.t('sampleEmpty')}</Text>
        <TouchableOpacity
          style={styles.createSampleButton}
          onPress={this.onCreateSample}
        >
          <Text style={styles.createSample}>{I18n.t('sampleCreate')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  onRowSwipe = (isOpened: boolean, id: string) => {
    const row = this._openedRowId && this._rows[this._openedRowId]
    if (isOpened && row && row.recenter) {
      row.recenter()
    }
    this._openedRowId = id
  }

  renderHeader = () => {
    if (!this.props.isComponent) {
      return null
    }

    if (!isEmpty(this.state.samples)) {
      return (
        <View style={styles.header}>
          <Text style={styles.title}>{I18n.t('sampleMenu')}</Text>
          <TouchableOpacity onPress={this.onCreateSample}>
            <Text style={styles.addButton}>{I18n.t('add')}</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={styles.header}>
        <Text style={styles.title}>{I18n.t('sampleMenu')}</Text>
      </View>
    )
  }

  renderHeaderComponent = () => {
    if (this.state.loading) {
      return <AIndicator containerStyle={styles.indicator} />
    }
    return null
  }

  renderViewMore = () => {
    const { limited } = this.props

    if (!limited || this._paging.isEnd(this._after)) {
      return null
    }
    const length = this._paging.next(this._after).length
    if (length === 0) {
      return null
    }
    const text = `${I18n.t('viewMore')} (${length})`
    return (
      <TouchableOpacity
        style={styles.viewMoreContainer}
        onPress={() => this.onScrollHandler(true)}
      >
        <Text style={styles.viewMore}>{text}</Text>
      </TouchableOpacity>
    )
  }

  renderItem = ({ item, index }) => {
    const sample = { ...item }
    return (
      <SampleQueryRow
        setRef={ref => (this._rows[sample.id] = ref)}
        sample={sample}
        onPress={() => this.onPressCard(item, index)}
        onAction={this.props.onAction}
        disableSwipeActions={this.props.disableSwipeActions}
        onRowSwipe={this.onRowSwipe}
      />
    )
  }

  extractKeys = (item: Sample, index: number) => {
    return `${item.id}-${index}`
  }

  renderPlaceholder = () => {
    const { samples = {} as any, loading } = this.state
    const { isComponent } = this.props
    if (samples.length > 0 || loading || isComponent) {
      return null
    }

    return (
      <SampleQueryPlaceholder
        type={this.props.type}
        onViewAll={this.props.onViewAll}
        onCreateSample={this.onCreateSample}
      />
    )
  }

  render() {
    const { fromMultiSearch } = this.props
    const { samples } = this.state

    if (fromMultiSearch && this._isShowEmpty) {
      return <APlaceholderMultiSearch hide={false} />
    }

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <FlatList
          ref={this._flatList}
          data={samples}
          keyExtractor={this.extractKeys}
          renderItem={this.renderItem}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          style={styles.list}
          keyboardShouldPersistTaps={'always'}
          onEndReached={() => this.onScrollHandler(false)} // Decrease this number to avoid FlatList from calling onEndReached multiple times
          onScroll={this.onScroll}
          bounces={false}
          onEndReachedThreshold={2}
          windowSize={61}
          initialNumToRender={30}
          maxToRenderPerBatch={30}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={this.renderHeaderComponent}
          listKey={'SampleQuery'}
        />
        {this.renderEmptyContent()}
        {this.renderViewMore()}
        {this.renderPlaceholder()}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // paddingBottom: isIphoneX() ? 34 : 0,
  },
  createSample: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
    paddingHorizontal: 4,
  },
  createSampleButton: {
    backgroundColor: colors.primary_blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    height: 32,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 44,
    width: 44,
    resizeMode: 'contain',
    tintColor: colors.pale_grey,
  },
  indicator: {
    marginTop: 12,
  },
  list: {
    flex: 1,
  },
  footer: {
    width: metrics.screen_width - metrics.keylines_screen_edge_margin * 2,
  },
  viewMoreContainer: {
    marginTop: 12,
    alignSelf: 'center',
    paddingTop: 6,
    paddingBottom: 18,
  },
  viewMore: {
    color: colors.primary_blue,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  sample: {
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.m,
    marginBottom: 24,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
    color: colors.dark_blue_grey,
    marginVertical: 14,
  },
  addButton: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
    color: colors.primary_blue,
  },
})
