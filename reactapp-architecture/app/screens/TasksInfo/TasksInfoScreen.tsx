import * as React from 'react'
import I18n from '@/i18n'
import ActionSheet from 'react-native-actionsheet'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
  InteractionManager,
} from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { ifIphoneX, statusBarHeight, isIpad } from '@/shared/devices'
import { colors, fonts, images, metrics } from '@/vars'
import { Task, Product, Supplier } from '@/models/team'
import { Subscription } from 'rxjs'
import { onDeleteTask } from '@/services/global'
import { User } from '@/models/common'
import { AppContext } from '../App/AppContext'
import { withContext } from '@/shared/withContext'
import { AppContextState } from '../App/AppContainer'
import { ADatePicker } from '@/components/APicker/ADatePicker'
import { SafeUser } from '@/shared/user'
import { get, isEmpty } from 'lodash'
import { UltiFactory } from '@/services/ulti'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment/min/moment-with-locales.js'
import { ProductCard } from '@/cards/Product/ProductCard'
import { SupplierCard } from '@/cards/Supplier/SupplierCard'
import { projectProductStore } from '@/stores/projectProductStore'
import { supplierStore } from '@/stores/supplierStore'
import { TaskActionType, TaskDetails } from './Components/TaskDetails'
import { Direction } from '@/common/constants/Direction'
import { CustomAlert } from '@/shared/alert'

type Props = Partial<{}> &
  Partial<
    NavigationInjectedProps<{
      task: Task
      taskId: string
    }>
  > &
  AppContextState

export type TaskState = 'open' | 'completed' | 'overdue'

export type State = {
  selectedUser: User
  chosenDate: Date
  task?: Task
  taskId?: string
  headerScrollEnabled: boolean
  textInputKey?: number
}

@withContext(AppContext.Consumer)
export class TasksInfoScreen extends React.PureComponent<Props, State> {
  _subscription: Subscription
  _onDeleteTaskSubscription: Subscription
  _actionSheetDelete: React.RefObject<ActionSheet> = React.createRef()
  _aDatePicker?: any
  _headerInputText: string
  _isDeleting: boolean

  state: State = {
    selectedUser: null,
    chosenDate: new Date(),
    task: {} as any,
    headerScrollEnabled: false,
    textInputKey: 0,
  }

  constructor(props) {
    super(props)

    this.state.task = this.props.navigation.getParam('task', {} as any)
    this._headerInputText = get(this.state.task, 'name', '')
    this.state.chosenDate = get(this.state.task, 'dueDate', new Date())
  }

  get getTaskState(): TaskState {
    const { task } = this.state
    if (!task) {
      return 'open'
    }
    if (task.done) {
      return 'completed'
    }
    if (task.dueDate && task.dueDate < new Date()) {
      return 'overdue'
    }
    return 'open'
  }

  componentDidMount(): void {
    const taskId =
      this.state.task.id || this.props.navigation.getParam('taskId', '')
    this.fetchTask(taskId)
    this._onDeleteTaskSubscription = onDeleteTask.subscribe(skipAlert => {
      if (skipAlert) {
        InteractionManager.runAfterInteractions(() => {
          this.goBack()
        })
        return
      }
      CustomAlert.error({
        message: I18n.t('thisTaskIsDeleted'),
        onPress: () => {
          this.goBack()
        },
      })
    })
  }

  componentWillUnmount(): void {
    this._subscription && this._subscription.unsubscribe()
    this._onDeleteTaskSubscription &&
      this._onDeleteTaskSubscription.unsubscribe()
  }

  fetchTask = (taskId: string) => {
    const { taskFactory } = this.props
    const [subscription, results] = taskFactory.fetchById(taskId)
    this._subscription = subscription.subscribe((task = {} as any) => {
      if (isEmpty(task) || (task && !task.isValid())) {
        // When the task is deleted from db directly
        if (!this._isDeleting) {
          CustomAlert.error({
            message: I18n.t('thisTaskIsDeleted') + 'asdasdasd',
            onPress: () => {
              this.goBack()
            },
          })
        }
        return
      }
      this.setState({ task, chosenDate: task.dueDate })
    })
  }

  goBack = () => {
    const { navigation } = this.props
    if (
      !navigation.isFocused() ||
      navigation.state.routeName !== 'TasksInfoScreen'
    ) {
      navigation.pop()
    }
    navigation.goBack()
  }

  onTaskAction = (type: TaskActionType) => {
    switch (type) {
      case 'changeDate':
        this.showDatePicker()
        break
      case 'delete':
        this._actionSheetDelete && this._actionSheetDelete.current.show()
        break
      case 'reAssign':
        this.props.navigation.navigate('SelectUserPicker', {
          onUserSelect: this.onUserSelect,
          selected: this.state.task.assignee,
          hideUpDownClear: true,
        })
        break
      case 'validate':
        this.updateTask('validate')
        break
    }
  }

  updateTask = (type: TaskActionType) => {
    const { task } = this.state
    if (!task) {
      return
    }
    const updateProps: any = {}
    const { taskFactory } = this.props
    const { chosenDate } = this.state

    if (type === 'reAssign') {
      const { selectedUser } = this.state
      if (!selectedUser) {
        return
      }
      updateProps.assignee = selectedUser
    }
    if (type === 'changeName') {
      if (this._headerInputText.trim()) {
        updateProps.name = this._headerInputText.trim()
      } else {
        this.setState({ textInputKey: this.state.textInputKey + 1 })
        Alert.alert(I18n.t('taskNameEmpty'), null, [{ text: I18n.t('ok') }])
        return
      }
    }
    if (type === 'changeDate') {
      updateProps.dueDate = chosenDate
    }
    if (type === 'delete') {
      updateProps.deleted = true
      updateProps.deletionDate = new Date()
      updateProps.deletedBy = UltiFactory.userData()
      this._isDeleting = true
    }
    if (type === 'validate') {
      updateProps.done = !task.done
      if (updateProps.done) {
        updateProps.completionDate = new Date()
      }
    }

    if (isEmpty(updateProps)) {
      return
    }
    taskFactory.update(task.id, updateProps).subscribe(() => {
      if (type === 'delete') {
        onDeleteTask.next(true)
      }
    })
  }

  showDatePicker = () => {
    this._aDatePicker && this._aDatePicker.show()
  }

  onSetValue = (data: any, key: string) => {
    const { task } = this.state
    if (!data || !task) {
      return
    }
    const updateProps: any = {}
    if (key === 'supplier') {
      updateProps.supplier = data
    }
    if (key === 'product') {
      updateProps.product = data
    }
    if (key === 'description') {
      updateProps.description = data
    }
    if (isEmpty(updateProps)) {
      return
    }
    const { taskFactory } = this.props

    taskFactory.update(task.id, updateProps).subscribe(() => {})
  }

  onMove = (type: string, direction: Direction) => {
    if (type === 'product') {
      this.props.navigation.pop()
      this.openSelectSupplier()
    }
    if (type === 'supplier') {
      this.props.navigation.pop()
      this.openSelectProduct()
    }
  }

  /**
   * Change the name of the task on keybord is blur
   */
  onHeaderInputBlur = () => {
    const { task = {} as any } = this.state
    if (this._headerInputText !== task.name) {
      this.updateTask('changeName')
    }
  }

  openTextEditor = () => {
    const { task = {} as any } = this.state
    const description = task.description || ''
    const screenHeight = metrics.screen_height
    const marginTop = Math.round((screenHeight * 10) / 9) / 10
    this.props.navigation.navigate('TextEditorModal', {
      description,
      hideActionBar: false,
      hideUpDownClear: true,
      isCreateProduct: true,
      setValue: this.onSetValue,
      modalProps: {
        height: screenHeight - marginTop,
        style: {
          marginTop,
        },
      },
    })
  }

  openSelectProduct = () => {
    const screenHeight = metrics.screen_height
    const marginTop = Math.round((screenHeight * 10) / 9) / 10
    this.props.navigation.navigate('SelectProductPicker', {
      setValue: this.onSetValue,
      onMove: (direction: Direction) => this.onMove('product', direction),
      isCreateProduct: true,
      hideActionBar: true,
      modalProps: {
        height: screenHeight - marginTop,
        style: {
          marginTop,
        },
      },
    })
  }

  openSelectSupplier = () => {
    const screenHeight = metrics.screen_height
    const marginTop = Math.round((screenHeight * 10) / 9) / 10
    this.props.navigation.navigate('SelectSupplierPicker', {
      setValue: this.onSetValue,
      onMove: (direction: Direction) => this.onMove('supplier', direction),
      isCreateProduct: true,
      hideActionBar: true,
      shouldNotSetProductRef: true,
      modalProps: {
        height: screenHeight - marginTop,
        style: {
          marginTop,
        },
      },
    })
  }

  onPressProduct = (type: string) => {
    if (type === 'product') {
      this.openSelectProduct()
    }
    if (type === 'supplier') {
      this.openSelectSupplier()
    }
  }

  onPressProductCard = (item: Product, index: number) => {
    const { navigation } = this.props

    if (!isIpad()) {
      navigation.push('ProductInfoScreen', {
        productName: item.name,
        productId: item.id,
        wasCreated: true,
      })
    } else {
      projectProductStore.select().next({
        item,
        index,
      })
    }
  }

  onPressSupplierCard = (item: Supplier, index: number) => {
    const { navigation } = this.props
    if (!isIpad()) {
      navigation.push('SupplierInfoScreen', {
        supplierId: item.id,
      })
    } else {
      supplierStore.select().next({
        item,
        index,
      })
    }
  }

  onUserSelect = (user: User) => {
    this.setState({ selectedUser: user }, () => this.updateTask('reAssign'))
  }

  onActionSheetPress = (index: number) => {
    if (index === 1) {
      CustomAlert.alertYesNo({
        message: I18n.t('deleteTaskConfirm'),
        onPressYes: () => this.updateTask('delete'),
        onPressNo: () => {},
      })
    }
  }

  renderHeader = () => {
    const { task = {} as any, headerScrollEnabled } = this.state
    let backgroundColor = '#45adff'
    if (this.getTaskState === 'overdue') {
      backgroundColor = colors.warning
    } else if (this.getTaskState === 'completed') {
      backgroundColor = colors.validated
    }
    return (
      <View style={[{ backgroundColor }, styles.headerContainer]}>
        <View style={styles.header}>
          <View style={styles.headerCol1}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image source={images.backArrow} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.wrapTitle}>
            <Text style={styles.title} numberOfLines={1}>
              {I18n.t('taskTitle')}
            </Text>
          </View>
          <View style={styles.rightButtons}>
            <TouchableOpacity onPress={() => this.onTaskAction('validate')}>
              <Image
                source={task.done ? images.tasksChecked : images.tasks}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapIconRight}
              onPress={() => this.onTaskAction('delete')}
            >
              <Image source={images.more} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          key={this.state.textInputKey}
          style={styles.headerTitle}
          multiline={true}
          numberOfLines={2}
          returnKeyType="done"
          blurOnSubmit={true}
          spellCheck={false}
          textContentType={'none'}
          defaultValue={task.name}
          selectTextOnFocus={false}
          autoCorrect={false}
          dataDetectorTypes={'none'}
          scrollEnabled={headerScrollEnabled}
          onFocus={() => this.setState({ headerScrollEnabled: true })}
          onChangeText={text => (this._headerInputText = text)}
          onBlur={this.onHeaderInputBlur}
          selectionColor={colors.white}
        />
      </View>
    )
  }

  renderDueDate = () => {
    const { task = {} as any } = this.state

    const { fullName } = new SafeUser(task.assignee)
    if (task.done) {
      const message = ` ${I18n.t('taskActionByUser')} ${fullName}`
      return (
        <View style={styles.dueDate}>
          <Image source={images.tasksChecked} style={styles.statusImage} />
          <Text style={styles.daysMessage}>{I18n.t('taskCompletedOn')} </Text>
          <Text style={styles.days}>
            {moment(task.completionDate || task.lastUpdatedDate).format(
              'DD MMMM YYYY'
            )}
          </Text>
          <Text style={styles.daysMessage}>{message}</Text>
        </View>
      )
    }
    if (!task.dueDate) {
      return null
    }
    const daysDiff = moment(new Date()).from(moment(task.dueDate), true)

    const minutesLeft = moment(task.dueDate).diff(moment(new Date()), 'minutes')
    if (minutesLeft <= 0) {
      return (
        <View style={styles.dueDate}>
          <Image source={images.warning} style={styles.dueDateWarning} />
          <Text style={styles.daysMessage}>{I18n.t('taskOverdue')} </Text>
          <Text style={styles.days}>{daysDiff}</Text>
        </View>
      )
    }
    return (
      <View style={styles.dueDate}>
        <Image source={images.warning} style={styles.dueDateLeft} />
        <Text style={styles.days}>{daysDiff}</Text>
        <Text style={styles.daysMessage}> {I18n.t('taskDueDateLeft')}</Text>
      </View>
    )
  }

  renderTaskDetails = () => {
    const { task = {} as any } = this.state

    return (
      <TaskDetails
        task={task}
        onTaskAction={this.onTaskAction}
        openTextEditor={this.openTextEditor}
      />
    )
  }

  renderEmptyProduct = (title: string, message: string, type: string) => {
    return (
      <View style={styles.emptyItemContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.emptyItem}>
          <Text style={styles.productEmpty}>{message}</Text>
          <TouchableOpacity
            style={styles.productSelectButton}
            onPress={() => this.onPressProduct(type)}
          >
            <Text style={styles.selectItem}>{I18n.t('select')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderLinkedProduct = () => {
    const { task = {} as any } = this.state
    if (!task.product) {
      return this.renderEmptyProduct(
        I18n.t('taskLinkedProduct'),
        I18n.t('taskNoLinkedProduct'),
        'product'
      )
    }
    return (
      <View style={styles.linkedItemContainer}>
        <View style={styles.linkedItem}>
          <Text style={styles.sectionTitle}>{I18n.t('taskLinkedProduct')}</Text>
          <TouchableOpacity onPress={this.openSelectProduct}>
            <Text style={styles.changeText}>{I18n.t('change')}</Text>
          </TouchableOpacity>
        </View>
        <ProductCard
          product={task.product}
          onPress={() => this.onPressProductCard(task.product, 0)}
          selected={false}
          currentIndex={0}
        />
      </View>
    )
  }

  renderLinkedSupplier = () => {
    const { task = {} as any } = this.state
    if (!task.supplier) {
      return this.renderEmptyProduct(
        I18n.t('taskLinkedSupplier'),
        I18n.t('taskNoLinkedSupplier'),
        'supplier'
      )
    }
    return (
      <View style={styles.linkedItemContainer}>
        <View style={styles.linkedItem}>
          <Text style={styles.sectionTitle}>
            {I18n.t('taskLinkedSupplier')}
          </Text>
          <TouchableOpacity onPress={this.openSelectSupplier}>
            <Text style={styles.changeText}>{I18n.t('change')}</Text>
          </TouchableOpacity>
        </View>
        <SupplierCard
          supplier={task.supplier}
          onPress={() => this.onPressSupplierCard(task.supplier, 0)}
          selected={false}
        />
      </View>
    )
  }

  renderBottomButton = () => {
    const action =
      this.getTaskState === 'completed'
        ? I18n.t('taskReopen')
        : I18n.t('taskComplete')
    const backgroundColor =
      this.getTaskState === 'completed'
        ? colors.close_icon_gray
        : colors.validated
    const color =
      this.getTaskState === 'completed' ? colors.blue_light_grey : colors.white
    return (
      <View style={styles.validateButtonContainer}>
        <TouchableOpacity
          style={[styles.validateButton, { backgroundColor }]}
          onPress={() => this.onTaskAction('validate')}
        >
          <Text style={[styles.validateButtonTitle, { color }]}>{action}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          showsVerticalScrollIndicator={true}
          enableResetScrollToCoords={false}
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'on-drag'}
          style={styles.content}
        >
          {this.renderDueDate()}
          {this.renderTaskDetails()}
          {this.renderLinkedProduct()}
          {this.renderLinkedSupplier()}
          <View style={styles.footerPadding} />
        </KeyboardAwareScrollView>
        {this.renderBottomButton()}
        <ActionSheet
          ref={this._actionSheetDelete}
          options={[I18n.t('taskCancel'), I18n.t('taskDelete')]}
          cancelButtonIndex={0}
          destructiveButtonIndex={1}
          onPress={this.onActionSheetPress}
        />
        <ADatePicker
          ref={pickerRef => (this._aDatePicker = pickerRef)}
          initialDate={this.state.chosenDate}
          onDateSelect={date =>
            this.setState({ chosenDate: date }, () =>
              this.updateTask('changeDate')
            )
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    backgroundColor: colors.pale_grey,
  },
  changeText: {
    color: '#45adff',
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  days: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPBold,
    color: colors.blue_light_grey,
  },
  daysMessage: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
  },
  dueDate: {
    backgroundColor: colors.background,
    width: '100%',
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dueDateWarning: {
    tintColor: colors.warning,
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 8,
  },
  dueDateLeft: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 8,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    height: Platform.select({
      ios: 60,
      android: 77,
    }),
    paddingTop: statusBarHeight(),
    ...ifIphoneX(
      {
        height: 80,
        paddingTop: statusBarHeight(),
      },
      {}
    ),
  },
  headerContainer: {
    width: '100%',
    paddingBottom: 10,
  },
  headerCol1: {
    flex: 2,
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xxxl,
    maxHeight: 70,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  productEmpty: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.xl,
    color: colors.light_blue_grey,
  },
  productSelectButton: {
    backgroundColor: '#e9edf5',
    borderRadius: 5,
    paddingHorizontal: 30,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    tintColor: colors.white,
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  sectionTitle: {
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
  },
  wrapTitle: {
    flex: 3.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.family.SSPRegular,
    marginHorizontal: metrics.base,
    fontSize: fonts.size.l,
    color: colors.white,
  },
  iconLeftCustom: {
    width: metrics.gallery_picture_screen_headerIconLeftCustom_width,
    height: metrics.gallery_picture_screen_headerIconLeftCustom_height,
    tintColor: colors.white,
  },
  rightButtons: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  wrapIconRight: {
    paddingLeft: metrics.keylines_screen_sign_in_margin - 14,
  },
  footerPadding: {
    flex: 1,
    minHeight: 60,
    backgroundColor: colors.pale_grey,
  },
  validateButtonContainer: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 26,
    shadowColor: 'rgba(163, 175, 198, 0.2)',
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 5,
  },
  validateButton: {
    borderRadius: 5,
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validateButtonTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  statusImage: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 8,
  },
  linkedItemContainer: {
    backgroundColor: colors.white,
  },
  linkedItem: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  selectItem: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  emptyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emptyItemContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
})
