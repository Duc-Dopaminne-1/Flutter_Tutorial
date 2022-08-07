import * as React from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import I18n from '@/i18n'
import ActionSheet from 'react-native-actionsheet'
import { TasksQuery } from './TasksQuery'
import { Factory } from '@/services/factory'
import { NavigationInjectedProps, DrawerActions } from 'react-navigation'
import { NavigationService } from '@/services/navigation'
import { colors, images } from '@/vars'
import { Task } from '@/models/team'
import { SearchKeywordType, onDeleteTask } from '@/services/global'
import { AScrollableTabViewTasks } from '@/components/AScrollableTabView/AScrollableTabViewTasks'
import { User } from '@/models/common'
import { AppContext } from '../App/AppContext'
import { withContext } from '@/shared/withContext'
import { AppContextState } from '../App/AppContainer'
import { TaskActionType } from './Components/TaskQueryRow'
import { isEmpty } from 'lodash'
import { UltiFactory } from '@/services/ulti'
import LinearGradient from 'react-native-linear-gradient'
import { ADatePicker } from '@/components/APicker/ADatePicker'
import { navigation } from '@/navigation/navigation'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'

type Props = Partial<{
  fromMultiSearch?: boolean
}> &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  filterBy: string
  selectedUser: User
  chosenDate: Date
}>

@withContext(AppContext.Consumer)
export class TasksScreen extends React.PureComponent<Props, State> {
  _actionSheet: React.RefObject<ActionSheet> = React.createRef()
  _actionSheetDelete: React.RefObject<ActionSheet> = React.createRef()
  _aDatePicker?
  _task?: Task
  _scrollableTabView?: any

  static defaultProps = {
    fromMultiSearch: false,
  }

  readonly state: State = {
    filterBy: 'done = false', // Show Incomplete Tasks by default
    selectedUser: null,
    chosenDate: new Date(),
  }

  componentDidMount(): void {
    const { type } = this.props

    if (type === SearchKeywordType.AllTasks) {
      this.setState({
        filterBy: undefined,
      })
    }
  }

  onPressBack = () => {
    // Go back and close the drawer
    const { navigation } = this.props
    navigation.navigate('HomeScreen', {}, navigation.dispatch(
      DrawerActions.closeDrawer()
    ) as any)
  }

  onTaskAction = (task: Task, type: TaskActionType) => {
    this._task = task
    switch (type) {
      case 'validate':
        this.updateTask('validate')
        break
      case 'changeDate':
        this.showDatePicker()
        break
      case 'delete':
        this._actionSheetDelete && this._actionSheetDelete.current.show()
        break
      case 'reAssign':
        navigation.navigate('SelectUserPicker', {
          onUserSelect: this.onUserSelect,
          selected: task.assignee,
          hideUpDownClear: true,
        })
        break
      default:
        break
    }
  }

  onTaskCreate = () => {
    navigation.navigate('CreateTaskPicker', {})
  }

  showDatePicker = () => {
    this._aDatePicker && this._aDatePicker.show()
  }

  updateTask = (type: TaskActionType) => {
    if (!this._task) {
      return
    }
    const updateProps: any = {}
    const { taskFactory } = this.props
    const { chosenDate } = this.state

    if (type === 'reAssign') {
      const { selectedUser } = this.state
      if (!selectedUser) {
        this._task = null
        return
      }
      updateProps.assignee = selectedUser
    }
    if (type === 'changeDate') {
      updateProps.dueDate = chosenDate
    }
    if (type === 'delete') {
      updateProps.deleted = true
      updateProps.deletionDate = new Date()
      updateProps.deletedBy = UltiFactory.userData()
    }
    if (type === 'validate') {
      updateProps.done = !this._task.done
    }

    if (isEmpty(updateProps)) {
      this._task = null
      return
    }
    taskFactory.update(this._task.id, updateProps).subscribe(() => {
      if (type === 'delete') {
        onDeleteTask.next()
      }
    })
    this._task = null
  }

  onFilterSelect = (index: number) => {
    switch (index) {
      case 1: // Incomplete Tasks
        this.setState({ filterBy: 'done = false' })
        return
      case 2: // Completed Tasks
        this.setState({ filterBy: 'done = true' })
        return
      case 3: // All Tasks
        this.setState({ filterBy: undefined })
        return
      default:
        return
    }
  }

  onViewAll = () => {
    this._scrollableTabView && this._scrollableTabView.goToPage(2)
  }

  onUserSelect = (user: User) => {
    this.setState({ selectedUser: user }, () => this.updateTask('reAssign'))
  }

  render() {
    const { filterBy } = this.state

    const { fromMultiSearch } = this.props
    if (fromMultiSearch) {
      return (
        <>
          <TasksQuery
            tabLabel={I18n.t('taskAllTasks')}
            query={filterBy ? `${filterBy}` : ''}
            fromMultiSearch={fromMultiSearch}
            disableSwipeActions={true}
            type={SearchKeywordType.AllTasks}
            onAction={this.onTaskAction}
            onViewAll={this.onViewAll}
          />
          <ActionSheet
            ref={this._actionSheet}
            title={I18n.t('taskFilter')}
            options={[
              I18n.t('taskCancel'),
              I18n.t('taskIncomplete'),
              I18n.t('taskCompleted'),
              I18n.t('taskAll'),
            ]}
            cancelButtonIndex={0}
            onPress={this.onFilterSelect}
          />
          <ActionSheet
            ref={this._actionSheetDelete}
            options={[I18n.t('taskCancel'), I18n.t('taskDelete')]}
            cancelButtonIndex={0}
            destructiveButtonIndex={1}
            onPress={(index: number) =>
              index === 1 && this.updateTask('delete')
            }
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
        </>
      )
    }

    return (
      <View style={styles.container}>
        <AScrollableTabViewTasks
          ref={ref => (this._scrollableTabView = ref)}
          placeholderSearch={I18n.t('taskSearch')}
          focusPlaceholderSearch={I18n.t('taskSearch')}
          onPressBack={this.onPressBack}
          onPressIcon={() => {
            this._actionSheet.current.show()
          }}
        >
          <TasksQuery
            tabLabel={I18n.t('taskAssignedToMe')}
            query={`assignee.id = "${Factory.user().identity}"${
              filterBy ? ` AND ${filterBy}` : ''
            }`}
            type={SearchKeywordType.AssignedToMeTasks}
            onAction={this.onTaskAction}
            onViewAll={this.onViewAll}
          />
          <TasksQuery
            tabLabel={I18n.t('taskMyTasks')}
            query={`createdBy.id = "${Factory.user().identity}"${
              filterBy ? ` AND ${filterBy}` : ''
            }`}
            type={SearchKeywordType.MyTasks}
            onAction={this.onTaskAction}
            onViewAll={this.onViewAll}
          />
          <TasksQuery
            tabLabel={I18n.t('taskAllTasks')}
            query={filterBy ? `${filterBy}` : ''}
            type={SearchKeywordType.AllTasks}
            onAction={this.onTaskAction}
            onViewAll={this.onViewAll}
          />
        </AScrollableTabViewTasks>
        <ActionSheet
          ref={this._actionSheet}
          title={I18n.t('taskFilter')}
          options={[
            I18n.t('taskCancel'),
            I18n.t('taskIncomplete'),
            I18n.t('taskCompleted'),
            I18n.t('taskAll'),
          ]}
          cancelButtonIndex={0}
          onPress={this.onFilterSelect}
        />
        <ActionSheet
          ref={this._actionSheetDelete}
          options={[I18n.t('taskCancel'), I18n.t('taskDelete')]}
          cancelButtonIndex={0}
          destructiveButtonIndex={1}
          onPress={(index: number) => index === 1 && this.updateTask('delete')}
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
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={this.onTaskCreate}
        >
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={['#d97bff', '#45adff']}
            style={styles.addButton}
          >
            <Image source={images.add} style={styles.addImage} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
  },
  addButtonContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 32,
    bottom: 32,
    shadowColor: 'rgba(203, 128, 255, 0.4)',
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 3,
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImage: {
    tintColor: colors.white,
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
})
