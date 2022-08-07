import * as React from 'react'
import { Keyboard } from 'react-native'
import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import { Team, User } from '@/models/common'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { CreateTaskList } from './Components/CreateTaskList'
import { ADatePicker } from '@/components/APicker/ADatePicker'
import { Product } from '@/models/team'
import { Toast, onItemCreated } from '@/services/global'
import { metrics } from '@/vars'

// default props
const defaultProps = {
  isUpdateSuccess: () => {},
}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<
  NavigationInjectedProps<{
    productsId?: string[]
    suppliersId?: string[]
    isUpdateSuccess?: () => void
    product?: Product
  }>
> &
  DefaultProps &
  AppContextState

export type State = {
  selectedUserId: string | number
  selectedUser: User
  chosenDate: Date
  dueDate: Date
}

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class CreateTaskPicker extends React.PureComponent<Props, State> {
  _teamMembersResults: Realm.Results<Team>
  _teamMembersSubscription: Subscription
  _modal
  _aDatePicker?

  state: State = {
    selectedUserId: null,
    selectedUser: undefined,
    chosenDate: new Date(),
    dueDate: undefined,
  }

  componentDidMount() {
    this.open()
  }

  onCreate = ({ taskName }) => {
    const { taskFactory, navigation, productFactory } = this.props
    const { selectedUser, dueDate } = this.state
    const productsId = navigation.getParam('productsId', [])
    const suppliersId = navigation.getParam('suppliersId', [])

    if (suppliersId.length > 0) {
      taskFactory
        .createMultiSupplier({
          dueDate,
          suppliersId,
          assignee: selectedUser && selectedUser._user,
          name: taskName,
          description: undefined,
        })
        .subscribe(() => {})
      this.close()

      Toast.next({
        message: I18n.t('tasksCreated', {
          total: suppliersId.length,
          isMany: suppliersId.length === 1 ? '' : 's',
        }),
      })

      const isUpdateSuccess = navigation.getParam('isUpdateSuccess', () => {})
      isUpdateSuccess && isUpdateSuccess()
      return
    }
    if (productsId.length > 0) {
      taskFactory
        .createMulti({
          dueDate,
          productsId,
          assignee: selectedUser && selectedUser._user,
          name: taskName,
          description: undefined,
        })
        .subscribe(() => {})
      this.close()

      Toast.next({
        message: I18n.t('tasksCreated', {
          total: productsId.length,
          isMany: productsId.length === 1 ? '' : 's',
        }),
      })

      const isUpdateSuccess = navigation.getParam('isUpdateSuccess', () => {})
      isUpdateSuccess && isUpdateSuccess()
      return
    }

    const product = navigation.getParam('product')
    const supplier = product && product.supplier ? product.supplier : null
    taskFactory
      .create({
        dueDate,
        product,
        supplier,
        assignee: selectedUser && selectedUser._user,
        name: taskName,
        description: undefined,
      })
      .subscribe(
        task => {
          this.close()
          onItemCreated.next({ task, type: 'task', id: task ? task.id : null })
        },
        () => {
          this.close()
        }
      )
  }

  open = () => {
    this._modal && this._modal.open()
  }

  close = () => {
    this._modal && this._modal.close()
  }

  onUserSelect = (user: User) => {
    this.setState({ selectedUser: user, selectedUserId: user.id })
  }

  onShowPicker = (type: string) => {
    Keyboard.dismiss()
    if (type === 'changeDate') {
      this.showDatePicker()
    }
    if (type === 'reAssign') {
      this.props.navigation.navigate('SelectUserPicker', {
        onUserSelect: this.onUserSelect,
        selected: this.state.selectedUser,
        hideUpDownClear: true,
      })
    }
  }

  showDatePicker = () => {
    this._aDatePicker && this._aDatePicker.show()
  }

  render() {
    const { selectedUser, dueDate } = this.state
    const screenHeight = metrics.screen_height

    return (
      <React.Fragment>
        <AModal3
          ref={nodeRef => (this._modal = nodeRef)}
          headerProps={{
            title: I18n.t('taskCreateNew'),
            onPressIconRight: this.close,
          }}
          textInputType="none"
          hideActionBar={true}
          pointerEvents="box-none"
          modalProps={{
            height: screenHeight * 0.76,
            style: {
              marginTop: screenHeight * 0.24,
            },
          }}
        >
          <CreateTaskList
            onCreate={this.onCreate}
            assignee={selectedUser}
            dueDate={dueDate}
            onShowPicker={this.onShowPicker}
          />
        </AModal3>
        <ADatePicker
          ref={pickerRef => (this._aDatePicker = pickerRef)}
          initialDate={this.state.chosenDate}
          onDateSelect={date =>
            this.setState({ dueDate: date, chosenDate: date })
          }
        />
      </React.Fragment>
    )
  }
}
