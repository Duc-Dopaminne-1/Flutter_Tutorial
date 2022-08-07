import * as React from 'react'
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  Picker,
} from 'react-native'
import { colors, fonts, devices } from '@/vars'
import { NavigationInjectedProps } from 'react-navigation'
import { get } from 'lodash'
import { User } from '@/models/user'
import { Team } from '@/models/common'
import { APicker } from '@/components/APicker/APicker'
import { AModal4 } from '@/components/AModal/AModal4'
import { sampleNavigation, SampleRef } from '@/navigation/sampleNavigation'
import { Subscription } from 'rxjs'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { SafeTeamUser } from '@/shared/teamUser'
import { SafeUser } from '@/shared/user'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { Product, Supplier } from '@/models/team'
import {
  supplierNavigation,
  SupplierRef,
} from '@/navigation/supplierNavigation'

type Props = Partial<{}> &
  Partial<
    NavigationInjectedProps<{
      onUserSelect: (user: User) => void
      selected: User
      isSample?: boolean
      isProduct?: boolean
      product?: Product
      isSupplier?: boolean
      supplier?: Supplier
      hideUpDownClear?: boolean
    }>
  > &
  AppContextState

type State = {
  selectedUserId: string | number
  users: Realm.Collection<User>
}

@withContext(AppContext.Consumer)
export class SelectUserPicker extends React.Component<Props, State> {
  _teamMembersResults: Realm.Results<Team>
  _teamMembersSubscription: Subscription

  _flatList: React.RefObject<FlatList<User>> = React.createRef()
  _modalPicker?: React.RefObject<AModal4> = React.createRef()

  static readonly defaultProps = {
    users: [],
    selected: null,
    hideUpDownClear: false,
  }

  state: State = {
    selectedUserId: '',
    users: [] as any,
  }

  componentDidMount() {
    this.open()
    const { teamUserFactory } = this.props
    const [subscription, results] = teamUserFactory.fetch()

    this._teamMembersResults = results

    this._teamMembersSubscription = subscription.subscribe(_users => {
      const users = _users
        .map(item => new SafeTeamUser(item))
        .filter(
          user =>
            user.accessType === 'Owner' || user.accessType === 'TeamMember'
        )
        .map(safeUser => new SafeUser(safeUser.user))
      let selectedUserId = get(users, '[0].id', null)
      const { selected } = this.safeDataNavigation
      if (selected) {
        selectedUserId = users.filter(usr => usr.id === selected)[0]
      }

      this.setState({
        users,
        selectedUserId: selectedUserId as string,
      })
    })
  }

  componentWillUnmount(): void {
    this._teamMembersResults && this._teamMembersResults.removeAllListeners()
    this._teamMembersSubscription && this._teamMembersSubscription.unsubscribe()
  }

  get safeDataNavigation() {
    const { navigation } = this.props

    const onUserSelect = navigation.getParam('onUserSelect', () => null)
    const selected = navigation.getParam('selected', null)
    const isSample = navigation.getParam('isSample', null)
    const isProduct = navigation.getParam('isProduct', null)
    const product = navigation.getParam('product', null)
    const isSupplier = navigation.getParam('isSupplier', null)
    const supplier = navigation.getParam('supplier', null)
    const hideUpDownClear = navigation.getParam('hideUpDownClear', false)
    return {
      onUserSelect,
      selected,
      isSample,
      isProduct,
      product,
      isSupplier,
      supplier,
      hideUpDownClear,
    }
  }

  open = () => {
    // @ts-ignore
    this._modalPicker && this._modalPicker.open()
  }

  close = () => {
    // @ts-ignore
    this._modalPicker && this._modalPicker.close()
  }

  onModalComplete = () => {
    const { selectedUserId, users } = this.state
    const { productFactory, supplierFactory } = this.props
    const {
      onUserSelect,
      selected: currentUser,
      isProduct,
      product,
      isSupplier,
      supplier,
    } = this.safeDataNavigation
    const selected = selectedUserId || (currentUser ? currentUser.id : '')
    const selectedUser = users.find(user => user.id === selected)
    if (selectedUser) {
      if (isProduct && product) {
        productFactory
          .update(product.id, { assignee: selectedUser as any })
          .subscribe(() => {})
      } else if (isSupplier && supplier) {
        supplierFactory
          .update(supplier.id, { assignee: selectedUser as any })
          .subscribe(() => {})
      }
      onUserSelect(selectedUser)
    }

    this.close()
  }

  onSelectUser = (id: string | number) => {
    this.setState({ selectedUserId: id })
  }

  renderItem = ({ item }) => {
    const { selectedUserId } = this.state
    const { selected: currentUser } = this.safeDataNavigation
    const selected = selectedUserId || (currentUser ? currentUser.id : '')
    const safeUser = new SafeUser(item)

    return (
      <TouchableOpacity
        style={[styles.container, selected === item.id && styles.selected]}
        onPress={() => this.onSelectUser(item.id)}
      >
        <Text style={styles.buttonTitle} numberOfLines={1}>
          {safeUser.fullName}
        </Text>
      </TouchableOpacity>
    )
  }

  renderItemIOS = (item: User) => {
    const safeUser = new SafeUser(item)
    return (
      <Picker.Item
        key={item.id}
        label={safeUser.fullName}
        value={safeUser.id}
      />
    )
  }

  renderPicker = () => {
    const { users, selectedUserId } = this.state
    const { selected } = this.safeDataNavigation
    const currentUserId = selected ? selected.id : ''

    if (devices.isIOS) {
      return (
        <APicker<any>
          data={users}
          value={(selectedUserId || currentUserId) as string}
          onValueChange={id => this.onSelectUser(id)}
          renderItem={() => {
            return users.map(value => this.renderItemIOS(value))
          }}
        />
      )
    }

    return (
      <FlatList
        ref={this._flatList}
        data={users}
        renderItem={this.renderItem}
        keyExtractor={(_item, index) => index.toString()}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps={'always'}
        style={styles.flatList}
        onScrollBeginDrag={() => Keyboard.dismiss()}
      />
    )
  }

  render() {
    const modalProps = {
      scrollEnabled: false,
    } as any
    const { hideUpDownClear } = this.safeDataNavigation

    return (
      <AModal4
        ref={nodeRef => {
          this._modalPicker = nodeRef
          const { isSample, isProduct, isSupplier } = this.safeDataNavigation
          if (isSample) {
            sampleNavigation.setRef(SampleRef.Assignee, nodeRef)
          }
          if (isProduct) {
            productNavigation.setRef(ProductRef.SelectAssignee, nodeRef)
          }
          if (isSupplier) {
            supplierNavigation.setRef(SupplierRef.SelectAssignee, nodeRef)
          }
        }}
        modalProps={modalProps}
        onComplete={this.onModalComplete}
        hideClearButton={true}
        hideUpDownClear={hideUpDownClear}
      >
        {this.renderPicker()}
      </AModal4>
    )
  }
}

const styles = StyleSheet.create<any>({
  flatList: {
    backgroundColor: colors.white,
  },
  container: {
    height: 52,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.border_gray,
    paddingRight: 30,
  },
  selected: {
    backgroundColor: colors.background_status_bar,
  },
  buttonTitle: {
    marginLeft: 14,
    color: colors.tag_text_color,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
})
