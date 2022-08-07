import * as React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Image,
  ImageSourcePropType,
  Platform,
} from 'react-native'
import Swipeable from 'react-native-swipeable-row'
import { Task } from '@/models/team'
import { NavigationInjectedProps } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'
import { colors, fonts, metrics, images } from '@/vars'
import moment from 'moment/min/moment-with-locales.js'
import I18n from '@/i18n'
import { Subscription } from 'rxjs'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { CacheResult } from '@/locals/models/cache-result'
import { get } from 'lodash'
import { LImage } from '@/libs/LImage'
import { SafeProduct } from '@/shared/product'
import { TaskActionButton, RightButton } from './TaskActionButton'

type Props = {
  task: Task
  onPress: (task: Task) => void
  onAction: (task: Task, type: TaskActionType) => void
  disableSwipeActions?: boolean
  onRowSwipe?: (isOpened: boolean, id: string) => void
  setRef?: (ref: any) => void
} & Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  uris: Image[]
  task: Task | null
  selected: boolean
  hideGradient: boolean
  isDone: boolean
}>

export type TaskActionType = 'validate' | 'reAssign' | 'delete' | 'changeDate'

@withContext(AppContext.Consumer)
export class TaskQueryRow extends React.PureComponent<Props, State> {
  _subscription: Subscription | undefined
  _supplierChangeSubscription: Subscription | undefined
  _results: Realm.Results<Task> | undefined
  _imageResults: Realm.Results<CacheResult> | undefined
  _imageSubscription: Subscription | undefined
  _latestChange = false
  _rightButtons: React.ReactNodeArray = []
  _swipableRef?: any = React.createRef()

  static readonly defaultProps = {
    modifications: [],
    onAction: Function.prototype,
    onRowSwipe: Function.prototype,
    setRef: Function.prototype,
  }

  readonly state: State = {
    uris: [] as any,
    task: null,
    selected: false,
    hideGradient: false,
    isDone: false,
  }

  constructor(props: Props) {
    super(props)
    this._rightButtons = [
      { text: 'Due Date', image: images.event, backgroundColor: '#50c2ff' },
      {
        text: 'Assign',
        image: images.user,
        backgroundColor: colors.primary_blue,
      },
      { text: 'Delete', image: images.trash, backgroundColor: colors.warning },
    ].map((item, index) => this.renderSwipableContent({ ...item, index }))
  }

  componentDidMount(): void {
    this.props.setRef(this._swipableRef)
    this.setState({
      isDone: this.props.task.done,
    })
  }

  componentWillUnmount(): void {}

  onValidateTask = () => {
    const { task } = this.props
    this.props.onAction(task, 'validate')
    this.setState({
      isDone: !task.done,
    })
  }

  renderExpiredDate = (dueDate: Date) => {
    const date = (moment(dueDate).format('DD MMM') || '').toUpperCase()
    return <Text style={styles.date}>{date}</Text>
  }

  renderImage = () => {
    const { task } = this.props
    const { isDone } = this.state
    const {
      images: { uri, first },
    } = new SafeProduct(task.product)

    const isExpired = task.dueDate && task.dueDate < new Date() && !isDone
    if (isExpired) {
      return this.renderExpiredDate(task.dueDate)
    }
    if (!uri && !first.id) {
      return null
    }
    return (
      <View style={styles.thumbnailContainer}>
        <LImage
          source={{
            uri,
            id: first.id,
          }}
          style={styles.thumbnail}
        />
      </View>
    )
  }

  onRightActionPress = (action: RightButton) => {
    let taskActionType: TaskActionType
    switch (action.index) {
      case 0:
        taskActionType = 'changeDate'
        break
      case 1:
        taskActionType = 'reAssign'
        break
      case 2:
        taskActionType = 'delete'
        break
    }
    this.props.onAction(this.props.task, taskActionType)
    this.closeRow()
  }

  closeRow = () => {
    if (this._swipableRef && this._swipableRef.recenter) {
      this._swipableRef.recenter()
    }
  }

  renderSwipableContent = (content: RightButton) => {
    return (
      <TaskActionButton
        content={content}
        onActionPress={this.onRightActionPress}
      />
    )
  }

  onRowPress = () => {
    const { onPress, task } = this.props
    onPress(task)
    this.setState({ selected: true }, () => {
      setTimeout(() => {
        this.setState({ selected: false })
      }, 1000)
    })
  }

  render() {
    const { task, disableSwipeActions, onRowSwipe } = this.props
    const { selected, hideGradient, isDone } = this.state

    const assignee = !task.assignee
      ? ''
      : `${I18n.t('taskAssignedTo')} ${get(
          task,
          'assignee.firstName',
          ''
        )} ${get(task, 'assignee.lastName', '')}`

    const isInProgress = task.inProgress && !isDone

    return (
      <Swipeable
        onRef={ref => (this._swipableRef = ref)}
        rightButtons={this._rightButtons}
        rightButtonWidth={60}
        disable={disableSwipeActions}
        onRightButtonsCloseRelease={() => onRowSwipe(false, task.id)}
        onRightButtonsOpenRelease={() => onRowSwipe(true, task.id)}
      >
        <TouchableHighlight
          style={styles.wrapItem}
          onPress={this.onRowPress}
          activeOpacity={0.01}
          underlayColor={colors.light_grey}
          onPressIn={() => this.setState({ hideGradient: true })}
          onPressOut={() => this.setState({ hideGradient: false })}
        >
          <View pointerEvents="none" />
        </TouchableHighlight>
        <View
          pointerEvents="box-none"
          style={[
            styles.wrapContainer,
            selected && styles.wrapContainerSelected,
          ]}
        >
          <TouchableOpacity onPress={this.onValidateTask}>
            <Image
              style={styles.check}
              source={isDone ? images.tasksChecked : images.tasks}
            />
          </TouchableOpacity>
          <View style={styles.texts} pointerEvents="none">
            <Text
              numberOfLines={1}
              ellipsizeMode="clip"
              style={styles.taskName}
            >
              {task.name}
            </Text>
            <View style={styles.assigneeContainer}>
              {!isInProgress ? null : (
                <View style={styles.inProgressContainer}>
                  <Text style={styles.inProgress}>{I18n.t('inProgress')}</Text>
                </View>
              )}
              <Text numberOfLines={1} style={styles.taskAssagnee}>
                {assignee}
              </Text>
            </View>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[
                'rgba(255,255,255,0)',
                selected || hideGradient ? 'rgba(255,255,255,0)' : '#fff',
              ]}
              style={styles.gradient}
            />
          </View>
          {this.renderImage()}
        </View>
        <View style={styles.bottomBorder} />
      </Swipeable>
    )
  }
}

const styles = StyleSheet.create<any>({
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    width: 50,
  },
  wrapContainer: {
    flex: 1,
    height: metrics.tasks_row_height,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  wrapContainerSelected: {
    backgroundColor: colors.light_grey,
  },
  check: {
    width: metrics.tasks_check_icon_size,
    height: metrics.tasks_check_icon_size,
    resizeMode: 'contain',
    marginHorizontal: 12,
  },
  wrapItem: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bottomBorder: {
    height: 1,
    backgroundColor: colors.pale_grey,
    left: 50,
    right: 0,
    position: 'absolute',
    bottom: 0,
  },
  taskName: {
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  taskAssagnee: {
    color: colors.text_light_grey,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.s,
  },
  thumbnailContainer: {
    width: metrics.tasks_product_image_size,
    height: metrics.tasks_product_image_size,
    borderRadius: metrics.prod_card_border_radius,
    marginRight: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  texts: {
    flex: 1,
    paddingRight: 12,
  },
  date: {
    color: colors.warning,
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPSemiBold,
    marginRight: 12,
  },
  thumbnail: {
    width: metrics.tasks_product_image_size,
    height: metrics.tasks_product_image_size,
  },
  rightIcon: {
    width: 15,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.white,
    marginBottom: 2,
  },
  rightButtonText: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xs,
    width: '100%',
    textAlign: 'center',
  },
  swipableContent: {
    height: 57,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inProgress: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: 8,
  },
  inProgressContainer: {
    backgroundColor: colors.pale_grey,
    paddingHorizontal: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    ...Platform.select({
      ios: {
        marginTop: 1,
      },
    }),
  },
})
