import * as React from 'react'
import { TaskActionType, TaskQueryRow } from './Components/TaskQueryRow'
import I18n from '@/i18n'
import { Product, Task } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import { colors, fonts, images, metrics } from '@/vars'
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import {
  scrollTabViewTask,
  searchKeyword,
  searchKeywordDashboard,
  SearchKeywordType,
} from '@/services/global'
import { Paging } from '@/paging'
import { debounce, isEmpty } from 'lodash'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { isIphoneX } from '@/shared/devices'
import { TasksQueryPlaceholder } from '@/screens/Tasks/Components/TasksQueryPlaceholder'
import { APlaceholderMultiSearch } from '@/components/APlaceHolder/APlaceholderMultiSearch'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'

type Props = Readonly<{
  type?: SearchKeywordType
  query?: string
  onAction: (task: Task, type: TaskActionType) => void
  disableSwipeActions?: boolean
  limited?: boolean
  initialLimit?: number
  isComponent?: boolean
  product?: Product
  onViewAll?: () => void
}> &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  tasks: Realm.Collection<Task>
  loading: boolean
}>

@DelayRender({ delay: 100 })
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class TasksQuery extends React.PureComponent<Props, State> {
  _flatList: React.RefObject<FlatList<Task>> = React.createRef()
  _fuse: FuseService<Task> = new FuseService<Task>([] as any)
  _results: Realm.Results<Task> = [] as any
  _subscription: Subscription
  _subSubscription: Subscription
  _updateKeywordSubscription: Subscription
  _paging: Paging<Task> = new Paging<Task>([] as any)
  _after: string = null
  _currentRenderIndex: number = 0
  _keyword: string = ''
  _pagingSearch: Paging<Task> = new Paging<Task>([] as any)
  _afterSearch: string = null
  _firstTimeLoadData: boolean = true
  _rows = {}
  _openedRowId: string = null
  _isShowEmpty = false

  static readonly defaultProps = {
    onViewAll: () => null,
  }

  state: State = {
    tasks: [] as any,
    loading: true,
  }

  componentDidMount() {
    this.fetchTasks()
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
      this.fetchTasks()
    }
  }

  fetchTasks = (_fetchMore: boolean = false) => {
    const { taskFactory, query, limited, initialLimit } = this.props

    if (!taskFactory) return

    const [subscription, results] = taskFactory.fetch({
      query,
      isReceiveChange: true,
    })

    this._results &&
      this._results.removeAllListeners &&
      this._results.removeAllListeners()
    this._subscription && this._subscription.unsubscribe()
    this._results = results
    this._subscription = subscription.subscribe(tasks => {
      this._paging.update(tasks.col)

      const limit = limited && initialLimit > 0 ? initialLimit : 30

      const newTasks = this._paging.getDataFromStart(
        tasks.change.insertions.length === 0 ? this._currentRenderIndex : 0,
        limit
      )
      this._after = this._paging.getLatestId(newTasks)
      this._currentRenderIndex = this._paging.currentIndex(this._after)

      this.resultUpdate(newTasks)
      this.searchUpdate(tasks.col, this._firstTimeLoadData)

      if (tasks.col.length >= 0 && this._keyword.trim().length === 0) {
        this._keyword = ''
        this.setState(
          {
            tasks: newTasks,
            loading: false,
          },
          () => {
            this._firstTimeLoadData = false
            searchKeyword.next({ text: '', type: this.props.type })
          }
        )
      } else if (tasks.col.length >= 0 && this._keyword.trim().length !== 0) {
        this.onChangeText(this._keyword)
      }
    })

    this._subSubscription && this._subSubscription.unsubscribe()
    this._subSubscription = taskFactory.subject().subscribe(value => {
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

  resultUpdate = tasks => {
    if (!tasks.removeAllListeners) {
      this._results &&
        this._results.removeAllListeners &&
        this._results.removeAllListeners()
    }

    this._results = tasks
  }

  searchUpdate = (tasks, isFirstTime: boolean = false) => {
    if (isFirstTime) {
      this._fuse = new FuseService<Task>(tasks, {
        keys: [
          'name',
          'description',
          'assignee.firstName',
          'assignee.lastName',
          'createdBy.name',
          'supplier.name',
        ] as any,
      })
      this.fetchSearchKeyword()
    } else {
      this._fuse.update(tasks)
    }
  }

  onPressCard = debounce((item: Task, _index: number) => {
    const { navigation } = this.props
    navigation.navigate('TasksInfoScreen', { task: item })
  }, 250)

  onScrollHandler = (force: boolean = false) => {
    const { tasks } = this.state
    const { isComponent } = this.props

    if (isComponent && !force) {
      return
    }

    if (!this._paging.isEnd(this._after) && this._keyword.trim().length === 0) {
      const nextTasks = this._paging.next(this._after)

      this._after = this._paging.getLatestId(nextTasks)
      this._currentRenderIndex = this._paging.currentIndex(this._after)

      const newTasks = tasks.concat(nextTasks)
      this.resultUpdate(newTasks)

      this.setState({ tasks: newTasks as any })
    } else if (
      !this._pagingSearch.isEnd(this._afterSearch) &&
      this._keyword.trim().length > 0
    ) {
      const nextTasks = this._pagingSearch.next(this._afterSearch)
      const newTasks = tasks.concat(nextTasks)

      this._afterSearch = this._paging.getLatestId(nextTasks)

      this.setState({
        tasks: newTasks as any,
      })
    }
  }

  onScroll = (event: any) => {
    scrollTabViewTask.next({
      y: event.nativeEvent.contentOffset.y,
      type: 'Task',
      flatListRef: this._flatList,
    })
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this._keyword = keyword
      this._isShowEmpty = true
      this.setState({
        tasks: this._results,
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
    const newTasks = this._pagingSearch.next(null)
    this._afterSearch = this._pagingSearch.getLatestId(newTasks)

    this.setState({
      tasks: newTasks,
    })
  }

  onAction = (task: Task, type: TaskActionType) => {
    if (type === 'validate') {
      const { taskFactory } = this.props
      taskFactory
        .update(task.id, { done: !task.done })
        .subscribe(() => {}, () => {})
      return
    }
    this.props.onAction(task, type)
  }

  onAddTask = () => {
    const { navigation, product } = this.props
    navigation.navigate('CreateTaskPicker', { product })
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

    if (!isEmpty(this.state.tasks)) {
      return (
        <View style={styles.header}>
          <Text style={styles.title}>{I18n.t('taskMenu')}</Text>
          <TouchableOpacity onPress={this.onAddTask}>
            <Text style={styles.addButton}>{I18n.t('add')}</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={styles.header}>
        <Text style={styles.title}>{I18n.t('taskMenu')}</Text>
      </View>
    )
  }

  renderEmptyContent = () => {
    if (!isEmpty(this.state.tasks) || !this.props.isComponent) {
      return null
    }

    return (
      <View style={styles.emptyContainer}>
        <Image style={styles.image} source={images.tasksChecked} />
        <Text style={styles.task}>{I18n.t('taskEmpty')}</Text>
        <TouchableOpacity
          style={styles.createTaskButton}
          onPress={this.onAddTask}
        >
          <Text style={styles.createTask}>{I18n.t('taskCreate')}</Text>
        </TouchableOpacity>
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
    const task = { ...item }
    return (
      <TaskQueryRow
        setRef={ref => (this._rows[task.id] = ref)}
        task={task}
        onPress={() => this.onPressCard(item, index)}
        onAction={this.onAction}
        disableSwipeActions={this.props.disableSwipeActions}
        onRowSwipe={this.onRowSwipe}
      />
    )
  }

  extractKeys = (item: Task, index: number) => {
    return `${item.id}-${index}`
  }

  renderPlaceholder = () => {
    const { tasks = {} as any, loading } = this.state
    const { isComponent } = this.props
    if (tasks.length > 0 || loading || isComponent) {
      return null
    }

    return (
      <TasksQueryPlaceholder
        type={this.props.type}
        onViewAll={this.props.onViewAll}
        onCreateSample={this.onAddTask}
      />
    )
  }

  render() {
    const { fromMultiSearch } = this.props
    const { tasks } = this.state

    if (fromMultiSearch && this._isShowEmpty) {
      return (
        <APlaceholderMultiSearch
          hide={false}
          keywordFromProps={this._keyword}
        />
      )
    }

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <FlatList
          ref={this._flatList}
          data={tasks}
          keyExtractor={this.extractKeys}
          renderItem={this.renderItem}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          style={styles.list}
          keyboardShouldPersistTaps={'always'}
          onEndReached={() => this.onScrollHandler(false)}
          onScroll={this.onScroll}
          bounces={false}
          onEndReachedThreshold={2} // Decrease this number to avoid FlatList from calling onEndReached multiple times
          windowSize={61}
          initialNumToRender={30}
          maxToRenderPerBatch={30}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={this.renderHeaderComponent}
          listKey={'TaskQuery'}
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
    paddingBottom: isIphoneX() ? 34 : 0,
  },
  list: {
    flex: 1,
    height: '100%',
  },
  footer: {
    width: metrics.screen_width - metrics.keylines_screen_edge_margin * 2,
  },
  viewMoreContainer: {
    marginTop: 12,
    alignSelf: 'center',
  },
  viewMore: {
    color: colors.primary_blue,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  createTask: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  createTaskButton: {
    backgroundColor: colors.primary_blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    height: 32,
  },
  emptyContainer: {
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 44,
    width: 37,
    resizeMode: 'contain',
    tintColor: colors.pale_grey,
  },
  indicator: {
    marginTop: 12,
  },
  task: {
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
